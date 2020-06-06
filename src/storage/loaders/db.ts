import BookmarksService from '../services/bookmarks';

export default async () => {
  await BookmarksService.load();
};
