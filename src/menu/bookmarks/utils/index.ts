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

export const removeItem = async (id: number, type?: string) => {
  if (type === 'folder') {
    const items = await db.bookmarks.filter(item => item.parent === id).toArray();

    for (let i = 0; i < items.length; i++) {
      removeItem(items[i].id, items[i].type);
    }
  }

  const bookmarks = Store.bookmarks;
  const item = bookmarks.find(x => x.id === id);

  bookmarks.splice(bookmarks.indexOf(item), 1);

  await db.bookmarks.delete(id);
};
