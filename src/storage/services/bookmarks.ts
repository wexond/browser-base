import { EventEmitter } from 'events';
import { promises as fs } from 'fs';

import {
  IBookmarkNode,
  IBookmarkSearchQuery,
  IBookmarkChanges,
  IBookmarkDestination,
  IBookmarkRemoveInfo,
  IBookmarkChangeInfo,
  IBookmarkMoveInfo,
  IBookmarkCreateInfo,
} from '~/interfaces';
import {
  IBookmarksDocument,
  IBookmarksDocumentNode,
  IBookmarksDocumentRoots,
} from '../interfaces';
import { readJsonFile } from '~/common/utils/files';
import { config } from '../constants';
import { parseStringToNumber } from '../utils';
import { makeId, makeGuuid } from '~/common/utils/string';
import { dateToChromeTime } from '~/common/utils/date';
import { BookmarksServiceBase } from '~/common/services/bookmarks';

class BookmarksService extends BookmarksServiceBase {
  private rootNode: IBookmarksDocumentNode;

  private idsMap = new Map<string, IBookmarksDocumentNode>();

  private roots: IBookmarksDocumentRoots = {};

  private saveTimeout: number;

  constructor() {
    super();

    this.on('changed', this.onAction);
    this.on('created', this.onAction);
    this.on('moved', this.onAction);
    this.on('removed', this.onAction);
  }

  private onAction = () => {
    clearTimeout(this.saveTimeout);

    this.saveTimeout = setTimeout(() => {
      this.save();
    }, 1000);
  };

  private get documentNodes() {
    return [...this.idsMap.values()];
  }

  private isFolder(node: IBookmarksDocumentNode | IBookmarkNode) {
    return node.url == null;
  }

  private limitIndex(children: IBookmarksDocumentNode[], index: number) {
    return Math.max(0, Math.min(index ?? children.length, children.length));
  }

  public async load() {
    const { roots } = await readJsonFile<IBookmarksDocument>(
      config.bookmarks,
      config.default.bookmarks,
    );

    const nodes = [
      roots.bookmark_bar,
      roots.other,
      roots.synced,
    ].map((r, index) => this.formatToDocumentNode(r, index, '0'));

    this.roots.bookmark_bar = nodes[0];
    this.roots.other = nodes[1];
    this.roots.synced = nodes[2];

    this.rootNode = {
      id: '0',
      name: '',
      children: nodes,
    };

    this.idsMap.set('0', this.rootNode);
  }

  public async save() {
    const document: IBookmarksDocument = {
      roots: this.roots,
      version: 1,
    };

    const data = JSON.stringify(document, null, 2);

    await fs.writeFile(config.bookmarks, data, 'utf8');

    console.log('Bookmarks saved!');
  }

  private formatToDocumentNode(
    node: IBookmarksDocumentNode,
    index?: number,
    parentId?: string,
  ) {
    let children = node.children;

    if (children) {
      children = children.map((r, index) =>
        this.formatToDocumentNode(r, index, node.id),
      );
    }

    const data: IBookmarksDocumentNode = { ...node, children, index, parentId };

    this.idsMap.set(node.id, data);

    return data;
  }

  private formatToNode(node: IBookmarksDocumentNode, withChildren = false) {
    const {
      id,
      parentId,
      index,
      url,
      name,
      date_modified,
      date_added,
      children,
    } = node;

    const data: IBookmarkNode = {
      id,
      parentId,
      index,
      url,
      title: name,
      dateGroupModified: parseStringToNumber(date_modified),
      dateAdded: parseStringToNumber(date_added),
    };

    if (withChildren && this.isFolder(node) && node.children) {
      data.children = children.map((r) => this.formatToNode(r, true));
    }

    return data;
  }

  private getDocumentNode(ids: string | string[]) {
    if (typeof ids === 'string') {
      ids = [ids];
    }

    const nodes: IBookmarksDocumentNode[] = [];

    ids.forEach((r) => {
      const node = this.idsMap.get(r);

      if (!node) throw new Error(`Can't find bookmark for id.`);

      nodes.push(node);
    });

    return nodes;
  }

  public get(ids: string | string[]) {
    return this.getDocumentNode(ids).map((r) => this.formatToNode(r));
  }

  public getChildren(id: string) {
    const [node] = this.getDocumentNode(id);

    if (!node.children) {
      return [];
    }

    return node.children.map((r) => this.formatToNode(r));
  }

  public getRecent(count: number) {
    return this.documentNodes
      .sort((x, y) => parseInt(y.date_added) - parseInt(x.date_added))
      .slice(0, count);
  }

  public getDocumentTree() {
    return this.rootNode;
  }

  public getTree() {
    return this.getSubTree('0');
  }

  public getSubTree(id: string) {
    const [node] = this.getDocumentNode(id);

    return this.formatToNode(node, true);
  }

  public search(query: string | IBookmarkSearchQuery) {
    if (typeof query === 'string') {
      const value = query.toLowerCase();

      return this.documentNodes.filter(
        ({ url, name }) =>
          (url && url.toLowerCase().includes(value)) ||
          (name && name.toLowerCase().includes(value)),
      );
    }

    const { url, title } = query;

    return this.documentNodes.filter(
      (r) =>
        (url == null || r.url === url) && (title == null || r.name === title),
    );
  }

  public create(data: IBookmarkCreateInfo = {}) {
    const parentId = data?.parentId ?? this.roots.other?.id;
    const [parentNode] = this.getDocumentNode(parentId);

    if (!this.isFolder(parentNode)) {
      throw new Error('Bookmark is not a folder!');
    }

    const chromeTime = dateToChromeTime(new Date()).toString();

    const documentNode: IBookmarksDocumentNode = {
      id: makeId(16),
      name: data.title,
      url: data.url,
      parentId: data?.parentId ?? this.roots.other?.id,
      date_added: chromeTime,
      type: data.url == null ? 'folder' : 'url',
      guid: makeGuuid(),
      index: this.limitIndex(parentNode.children, data.index),
    };

    this.addChild(documentNode, parentNode, documentNode.index);

    const node = this.formatToNode(documentNode);

    this.emit('created', node.id, node);

    return node;
  }

  public move(id: string, dest: IBookmarkDestination) {
    const [node] = this.getDocumentNode(id);
    const newParentId = dest?.parentId ?? node.parentId;

    const [parentNode, newParentNode] = this.getDocumentNode([
      node.parentId,
      newParentId,
    ]);

    const currentIndex = node.index;
    let destIndex = dest?.index;

    if (destIndex == null) {
      destIndex = newParentNode.children.length;

      if (parentNode.id === newParentNode.id) {
        destIndex--;
      }
    }

    node.parentId = newParentId;
    node.index = destIndex;

    this.removeChild(parentNode, currentIndex);
    this.addChild(node, newParentNode, destIndex);

    this.emit(id, {
      index: destIndex,
      oldIndex: currentIndex,
      oldParentId: parentNode.id,
      parentId: newParentNode.id,
    } as IBookmarkMoveInfo);

    return node;
  }

  public update(id: string, changes: IBookmarkChanges) {
    const [node] = this.getDocumentNode(id);

    if (changes?.title) node.name = changes.title;
    if (changes?.url) node.url = changes.url;

    this.emit('changed', id, changes as IBookmarkChangeInfo);

    return node;
  }

  private addChild(
    child: IBookmarksDocumentNode,
    parent: IBookmarksDocumentNode,
    index: number,
  ) {
    parent.children.splice(index, 0, child);
    parent.children.slice(index + 1).forEach((r) => r.index++);
  }

  private removeChild(parent: IBookmarksDocumentNode, index: number) {
    parent.children.splice(index, 1);
    parent.children.slice(index).forEach((r) => r.index--);
  }

  private removeReference(node: IBookmarksDocumentNode) {
    this.idsMap.delete(node.id);
    node.children?.forEach((r) => this.removeReference(r));
  }

  private removeDocumentNode(node: IBookmarksDocumentNode) {
    const [parentNode] = this.getDocumentNode(node.parentId);

    this.removeChild(parentNode, node.index);
    this.removeReference(node);
  }

  public remove(id: string) {
    const [node] = this.getDocumentNode(id);

    if (this.isFolder(node) && node.children?.length) {
      throw new Error(`Can't remove non-empty folder (use recursive to force)`);
    }

    this.removeDocumentNode(node);
  }

  public removeTree(id: string) {
    const [documentNode] = this.getDocumentNode(id);
    const node = this.formatToNode(documentNode, true);

    this.removeDocumentNode(documentNode);

    this.emit('removed', id, {
      index: node.index,
      parentId: node.parentId,
      node,
    } as IBookmarkRemoveInfo);
  }
}

export default new BookmarksService();
