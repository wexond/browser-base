import { db } from '../loaders/db';
import { IBookmarkNode } from '~/interfaces';

class BookmarkService {
  public get(ids: string | string[]) {
    if (typeof ids === 'string') {
      ids = [ids];
    }

    const query = db.prepare(`SELECT * FROM bookmarks WHERE id = ?`);

    return ids.map((r) => query.get(r));
  }

  public getChildren(id: string): IBookmarkNode[] {
    return db.prepare(`SELECT * FROM bookmarks WHERE parentId = ?`).all(id);
  }

  public isFolder(node: IBookmarkNode) {
    return node.url != null;
  }
}

export default new BookmarkService();
