import AppStore from '../../../app/store';
import BookmarkItem from '../../../shared/models/bookmark-item';
import db from '../../../shared/models/app-database';

export const getPath = (parent: number) => {
  const parentFolder = AppStore.bookmarks.find(x => x.id === parent);
  let path: BookmarkItem[] = [];

  if (parentFolder == null) return [];

  if (parentFolder.parent !== -1) {
    path = path.concat(getPath(parentFolder.parent));
  }

  path.push(parentFolder);

  return path;
};

export const addBookmark = async (item: BookmarkItem) => {
  item.id = await db.bookmarks.add(item);
  AppStore.bookmarks.push(item);
  return item;
};

export const addFolder = (title: string, parent: number) => {
  db.transaction('rw', db.bookmarks, async () => {
    const item: BookmarkItem = {
      title,
      parent,
      type: 'folder',
    };

    item.id = await db.bookmarks.add(item);
    AppStore.bookmarks.push(item);
  });
};

export const removeItem = async (id: number, type: string) => {
  if (type === 'folder') {
    const items = AppStore.bookmarks.filter(item => item.parent === id);

    for (let i = 0; i < items.length; i++) {
      removeItem(items[i].id, items[i].type);
    }
  }

  const item = AppStore.bookmarks.find(x => x.id === id);
  AppStore.bookmarks.splice(AppStore.bookmarks.indexOf(item), 1);

  const selectedTab = AppStore.getSelectedTab();

  if (AppStore.isStarred && selectedTab.url === item.url) {
    AppStore.isStarred = false;
  }

  await db.bookmarks.delete(id);
};

export const getBookmarkFolders = () => AppStore.bookmarks.filter(el => el.type === 'folder');
