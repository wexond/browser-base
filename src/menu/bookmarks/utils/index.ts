import Store from '../store';
import BookmarkItem from '../../../shared/models/bookmark-item';
import db from '../../../shared/models/app-database';

export const getPath = (parent: number) => {
  const parentFolder = Store.bookmarks.find(x => x.id === parent);
  let path: BookmarkItem[] = [];

  if (parentFolder == null) return [];

  if (parentFolder.parent !== -1) {
    path = path.concat(getPath(parentFolder.parent));
  }

  path.push(parentFolder);

  return path;
};

export const addFolder = (title: string, parent: number) => {
  db.transaction('rw', db.bookmarks, async () => {
    const item: BookmarkItem = {
      title,
      parent,
      type: 'folder',
    };

    item.id = await db.bookmarks.add(item);
    Store.bookmarks.push(item);
  });
};
