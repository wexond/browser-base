import database from '../database';
import { BookmarkItem } from '../interfaces';
import store from '../renderer/store';

export const getBookmarkFolderPath = (parent: number) => {
  const parentFolder = store.bookmarks.find(x => x.id === parent);
  let path: BookmarkItem[] = [];

  if (parentFolder == null) return [];

  if (parentFolder.parent !== -1) {
    path = path.concat(getBookmarkFolderPath(parentFolder.parent));
  }

  path.push(parentFolder);

  return path;
};

export const addBookmark = async (item: BookmarkItem) => {
  item.id = await database.bookmarks.add(item);
  store.bookmarks.push(item);
  return item;
};

export const addFolder = (title: string, parent: number) => {
  database.transaction('rw', database.bookmarks, async () => {
    const item: BookmarkItem = {
      title,
      parent,
      type: 'folder',
    };

    item.id = await database.bookmarks.add(item);
    store.bookmarks.push(item);
  });
};

export const removeItem = async (id: number, type: string) => {
  if (type === 'folder') {
    const items = store.bookmarks.filter(item => item.parent === id);

    for (let i = 0; i < items.length; i++) {
      removeItem(items[i].id, items[i].type);
    }
  }

  const item = store.bookmarks.find(x => x.id === id);
  store.bookmarks.splice(store.bookmarks.indexOf(item), 1);

  const selectedTab = store.getSelectedTab();

  if (store.isBookmarked && selectedTab.url === item.url) {
    store.isBookmarked = false;
  }

  await database.bookmarks.delete(id);
};

export const getBookmarkFolders = () => store.bookmarks.filter(el => el.type === 'folder');
