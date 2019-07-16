import { IBookmark } from '~/interfaces';

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
