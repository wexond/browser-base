import { readJsonFile } from '~/common/utils/files';
import { config } from '../constants';
import { IBookmarksDocument, IBookmarksDocumentRoot } from '../interfaces';
import {
  IBookmarkNode,
  IBookmarkSearchQuery,
  IBookmarkChanges,
  IBookmarkDestination,
} from '~/interfaces';
import { parseStringToNumber } from '../utils';
import { makeId, randomId, makeGuuid } from '~/common/utils/string';
import { dateToChromeTime } from '~/common/utils/date';

class BookmarkService {
  private rootNode: IBookmarksDocumentRoot;

  private idsMap = new Map<string, IBookmarksDocumentRoot>();

  private otherBookmarks: IBookmarksDocumentRoot;

  private get nodes() {
    return [...this.idsMap.values()];
  }

  private format(root: IBookmarksDocumentRoot, withChildren = false) {
    const {
      id,
      parentId,
      index,
      url,
      name,
      date_modified,
      date_added,
      children,
    } = root;

    const node: IBookmarkNode = {
      id,
      parentId,
      index,
      url,
      title: name,
      dateGroupModified: parseStringToNumber(date_modified),
      dateAdded: parseStringToNumber(date_added),
    };

    if (withChildren && this.isFolder(root)) {
      node.children = children.map((r) => this.format(r, true));
    }

    return node;
  }

  private isFolder(node: IBookmarksDocumentRoot | IBookmarkNode) {
    return node.url == null;
  }

  private limitIndex(children: IBookmarksDocumentRoot[], index: number) {
    return Math.max(0, Math.min(index ?? children.length, children.length));
  }

  public async load() {
    const { roots } = await readJsonFile<IBookmarksDocument>(
      config.bookmarks,
      config.default.bookmarks,
    );

    const children = [
      roots.bookmark_bar,
      roots.other,
      roots.synced,
    ].map((r, index) => this.formatRoot(r, index, '0'));

    this.otherBookmarks = children[1];

    this.rootNode = {
      id: '0',
      name: '',
      children,
    };

    this.idsMap.set('0', this.rootNode);
  }

  private formatRoot(
    root: IBookmarksDocumentRoot,
    index?: number,
    parentId?: string,
  ) {
    let children = root.children;

    if (children) {
      children = children.map((r, index) => this.formatRoot(r, index, root.id));
    }

    const data: IBookmarksDocumentRoot = { ...root, children, index, parentId };

    this.idsMap.set(root.id, data);

    return data;
  }

  private getRoot(ids: string | string[]) {
    if (typeof ids === 'string') {
      ids = [ids];
    }

    const nodes: IBookmarksDocumentRoot[] = [];

    ids.forEach((r) => {
      const node = this.idsMap.get(r);

      if (!node) throw new Error(`Can't find bookmark for id.`);

      nodes.push(node);
    });

    return nodes;
  }

  public get(ids: string | string[]) {
    return this.getRoot(ids).map((r) => this.format(r));
  }

  public getRecent(count: number) {
    return this.nodes
      .sort((x, y) => parseInt(y.date_added) - parseInt(x.date_added))
      .slice(0, count);
  }

  public getChildren(id: string) {
    const [root] = this.getRoot(id);

    if (!root.children) return [];

    return root.children.map((r) => this.format(r));
  }

  public getTree() {
    return this.rootNode;
  }

  public getSubTree(id: string) {
    const [root] = this.getRoot(id);

    return this.format(root, true);
  }

  public search(query: string | IBookmarkSearchQuery) {
    if (typeof query === 'string') {
      const value = query.toLowerCase();

      return this.nodes.filter(
        ({ url, name }) =>
          (url && url.toLowerCase().includes(value)) ||
          (name && name.toLowerCase().includes(value)),
      );
    }

    const { url, title } = query;

    return this.nodes.filter((r) => {
      return !(
        (url != null && r.url !== url) ||
        (title != null && r.name !== title)
      );
    });
  }

  public create(data: IBookmarkNode = {}) {
    const parentId = data?.parentId ?? this.otherBookmarks.id;
    const [parentRoot] = this.getRoot(parentId);

    if (!this.isFolder(parentRoot)) {
      throw new Error('Bookmark not a folder!');
    }

    const chromeTime = dateToChromeTime(new Date()).toString();

    const node: IBookmarksDocumentRoot = {
      id: makeId(16),
      name: data.title,
      url: data.url,
      parentId: data?.parentId ?? this.otherBookmarks.id,
      date_added: chromeTime,
      type: data.url == null ? 'folder' : 'url',
      guid: makeGuuid(),
      index: this.limitIndex(parentRoot.children, data.index),
    };

    parentRoot.children.splice(node.index, 0, node);
    parentRoot.children.slice(node.index + 1).forEach((r) => r.index++);

    return this.format(node);
  }

  public move(id: string, dest: IBookmarkDestination) {
    const [root] = this.getRoot(id);

    const newParentId = dest?.parentId ?? root.parentId;

    const [parentRoot, newParentRoot] = this.getRoot([
      root.parentId,
      newParentId,
    ]);

    const currentIndex = root.index;
    let destIndex = dest?.index;

    if (destIndex == null) {
      destIndex = newParentRoot.children.length;

      if (parentRoot.id === newParentRoot.id) {
        destIndex--;
      }
    }

    root.parentId = newParentId;
    root.index = destIndex;

    parentRoot.children.splice(currentIndex, 1);
    parentRoot.children.slice(currentIndex).forEach((r) => r.index--);

    newParentRoot.children.splice(destIndex, 0, root);
    newParentRoot.children.slice(destIndex + 1).forEach((r) => r.index++);

    return [parentRoot, newParentRoot];
  }

  public update(id: string, changes: IBookmarkChanges) {
    const [root] = this.getRoot(id);

    if (changes?.title) {
      root.name = changes.title;
    }

    if (changes?.url) {
      root.url = changes.url;
    }

    return root;
  }

  private removeRootReference(root: IBookmarksDocumentRoot) {
    this.idsMap.delete(root.id);
    root.children?.forEach((r) => this.removeRootReference(r));
  }

  private removeRoot(root: IBookmarksDocumentRoot) {
    const [parentRoot] = this.getRoot(root.parentId);
    const index = parentRoot.children.indexOf(root);

    parentRoot.children.splice(index, 1);
    parentRoot.children.slice(index).forEach((r) => r.index--);

    this.removeRootReference(root);
  }

  public remove(id: string) {
    const [root] = this.getRoot(id);

    if (this.isFolder(root) && root.children?.length) {
      throw new Error(`Can't remove non-empty folder (use recursive to force)`);
    }

    this.removeRoot(root);
  }

  public removeTree(id: string) {
    const [root] = this.getRoot(id);

    this.removeRoot(root);

    return [this.rootNode.children[0], this.idsMap.get('358')];
  }
}

export default new BookmarkService();
