import Store from '../store';
import BookmarkItem from '../../../shared/models/bookmark-item';

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
