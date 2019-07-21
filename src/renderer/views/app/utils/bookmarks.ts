import { IBookmark } from '~/interfaces';
import store from '../store';

export const getBookmarkTitle = (item: IBookmark) => {
  if (!item.static) return item.title;

  if (item.static === 'main') {
    return 'Bookmarks bar';
  }

  if (item.static === 'mobile') {
    return 'Mobile bookmarks';
  }
  if (item.static === 'other') {
    return 'Other bookmarks';
  }

  return '';
};

export const addImported = async (arr: any[], parent: IBookmark = null) => {
  for (const item of arr) {
    if (item.ns_root) {
      if (item.ns_root === 'toolbar') {
        const folder = store.bookmarks.list.find(x => x.static === 'main');
        addImported(item.children, folder);
      }

      return;
    }

    const bookmark = await store.bookmarks.addItem({
      isFolder: item.type === 'folder',
      title: item.title,
      url: item.url,
      parent: parent && parent._id,
      children: [],
      favicon: item.icon,
    });

    if (parent) {
      parent.children.push(bookmark._id);
    }

    if (bookmark.isFolder) {
      addImported(item.children, bookmark);
    }
  }
};
