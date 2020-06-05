import { readJsonFile } from '~/common/utils/files';
import { config } from '../constants';
import { IBookmarksDocument, IBookmarksDocumentRoot } from '../interfaces';
import { IBookmarkNode } from '~/interfaces';
import { parseStringToNumber } from '../utils';

class BookmarkService {
  private rootNode: IBookmarksDocumentRoot;

  private idsMap = new Map<string, IBookmarksDocumentRoot>();

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

    this.idsMap.set('0', this.rootNode);
  }

  private formatRoot(
    root: IBookmarksDocumentRoot,
    index?: number,
    parentId?: string,
  ) {
    let children = root.children;

    if (children) {
      children = children
        .sort((x, y): any => x.guid < y.guid)
        .map((r, index) => this.formatRoot(r, index, root.id));
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
    const items = [...this.idsMap.values()];

    return items
      .sort((x, y) => parseInt(y.date_added) - parseInt(x.date_added))
      .slice(0, count);
  }

  public getChildren(id: string) {
    const [root] = this.getRoot(id);

    if (!root.children) return [];

    return root.children.map((r) => this.format(r));
  }

  public getSubTree(id: string) {
    const [root] = this.getRoot(id);

    const data = this.format(root, true);
    console.log(process.memoryUsage());

    return data;
  }

  public getTree() {
    return this.rootNode;
  }
}

export default new BookmarkService();
