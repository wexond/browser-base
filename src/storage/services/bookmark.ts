import { readJsonFile } from '~/common/utils/files';
import { config } from '../constants';
import { IBookmarksDocument, IBookmarksDocumentRoot } from '../interfaces';
import { IBookmarkNode } from '~/interfaces';
import { parseStringToNumber } from '../utils';

class BookmarkService {
  private rootNode: IBookmarksDocumentRoot;

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

  public async load() {
    const { roots } = await readJsonFile<IBookmarksDocument>(
      config.bookmarks,
      config.default.bookmarks,
    );

    const nodes = [roots.bookmark_bar, roots.other, roots.synced];

    this.rootNode = {
      id: '0',
      name: '',
      children: nodes.map((r, index) => this.formatRoot(r, index, '0')),
    };
  }

  private formatRoot(
    root: IBookmarksDocumentRoot,
    index?: number,
    parentId?: string,
  ): IBookmarksDocumentRoot {
    let children = root.children;

    if (children) {
      children = this.sortRootChildren(children).map((r, index) =>
        this.formatRoot(r, index, root.id),
      );
    }

    return { ...root, children, index, parentId };
  }

  private sortRootChildren(children: IBookmarksDocumentRoot[]) {
    return children.sort((x, y): any => x.guid < y.guid);
  }

  private getRoot(ids: string | string[]) {
    if (typeof ids === 'string') {
      ids = [ids];
    }

    const nodes: IBookmarksDocumentRoot[] = [];

    const queue = [this.rootNode];

    while (queue.length !== 0) {
      const item = queue.shift();

      if (ids.includes(item.id)) {
        nodes.push(item);

        if (nodes.length === ids.length) {
          return nodes;
        }
      } else if (item.children) {
        queue.push(...item.children);
      }
    }

    return undefined;
  }

  public get(ids: string | string[]) {
    return this.getRoot(ids).map((r) => this.format(r));
  }

  public getSubTree(id: string) {
    const [root] = this.getRoot(id);

    return this.format(root, true);
  }

  public getTree() {
    return this.rootNode;
  }
}

export default new BookmarkService();
