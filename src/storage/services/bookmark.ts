import { readJsonFile } from '~/common/utils/files';
import { config } from '../constants';
import { IBookmarksDocument, IBookmarksDocumentNode } from '../interfaces';
import {
  IBookmarkNode,
  IBookmarkSearchQuery,
  IBookmarkChanges,
  IBookmarkDestination,
} from '~/interfaces';
import { parseStringToNumber } from '../utils';
import { makeId, makeGuuid } from '~/common/utils/string';
import { dateToChromeTime } from '~/common/utils/date';

class BookmarkService {
  private rootNode: IBookmarksDocumentNode;

  private idsMap = new Map<string, IBookmarksDocumentNode>();

  private otherBookmarks: IBookmarksDocumentNode;

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
    ].map((r, index) => this.formatDocumentNode(r, index, '0'));

    this.otherBookmarks = nodes[1];
    this.rootNode = {
      id: '0',
      name: '',
      children: nodes,
    };

    this.idsMap.set('0', this.rootNode);
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

    if (withChildren && this.isFolder(node)) {
      data.children = children.map((r) => this.formatToNode(r, true));
    }

    return data;
  }

  private formatDocumentNode(
    root: IBookmarksDocumentNode,
    index?: number,
    parentId?: string,
  ) {
    let children = root.children;

    if (children) {
      children = children.map((r, index) =>
        this.formatDocumentNode(r, index, root.id),
      );
    }

    const data: IBookmarksDocumentNode = { ...root, children, index, parentId };

    this.idsMap.set(root.id, data);

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

  public getRecent(count: number) {
    return this.documentNodes
      .sort((x, y) => parseInt(y.date_added) - parseInt(x.date_added))
      .slice(0, count);
  }

  public getChildren(id: string) {
    const [node] = this.getDocumentNode(id);

    if (!node.children) {
      return [];
    }

    return node.children.map((r) => this.formatToNode(r));
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

  public create(data: IBookmarkNode = {}) {
    const parentId = data?.parentId ?? this.otherBookmarks.id;
    const [parentNode] = this.getDocumentNode(parentId);

    if (!this.isFolder(parentNode)) {
      throw new Error('Bookmark is not a folder!');
    }

    const chromeTime = dateToChromeTime(new Date()).toString();

    const node: IBookmarksDocumentNode = {
      id: makeId(16),
      name: data.title,
      url: data.url,
      parentId: data?.parentId ?? this.otherBookmarks.id,
      date_added: chromeTime,
      type: data.url == null ? 'folder' : 'url',
      guid: makeGuuid(),
      index: this.limitIndex(parentNode.children, data.index),
    };

    this.addChild(node, parentNode, node.index);

    return this.formatToNode(node);
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

    return [parentNode, newParentNode];
  }

  public update(id: string, changes: IBookmarkChanges) {
    const [node] = this.getDocumentNode(id);

    if (changes?.title) node.name = changes.title;
    if (changes?.url) node.url = changes.url;

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
    const [node] = this.getDocumentNode(id);

    this.removeDocumentNode(node);
  }
}

export default new BookmarkService();
