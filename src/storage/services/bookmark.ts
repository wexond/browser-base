import { db } from '../loaders/db';
import { IBookmarkNode } from '~/interfaces';

class BookmarkService {
  public isFolder(node: IBookmarkNode) {
    return node.url == null;
  }

  public get(ids: string | string[]): IBookmarkNode[] {
    if (typeof ids === 'string') {
      ids = [ids];
    }

    const query = db.prepare(`SELECT * FROM bookmarks WHERE id = ?`);

    return ids.map((r) => query.get(r));
  }

  public getChildren(id: string): IBookmarkNode[] {
    return db.prepare(`SELECT * FROM bookmarks WHERE parentId = ?`).all(id);
  }

  public getSubTree(id: string, node?: IBookmarkNode): IBookmarkNode[] {
    const _node = node || this.get(id)[0];

    const children = this.getChildren(id).map((r) =>
      this.isFolder(r) ? this.getSubTree(r.id, r)[0] : r,
    );

    return [{ ..._node, children }];
  }
}

export default new BookmarkService();
