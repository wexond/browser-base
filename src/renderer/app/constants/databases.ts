import Datastore from 'nedb';

import { getPath } from '~/shared/utils/paths';

export const databases = {
  history: new Datastore({
    filename: getPath('storage/history.db'),
    autoload: true,
  }),
  bookmarks: new Datastore({
    filename: getPath('storage/bookmarks.db'),
    autoload: true,
  }),
  favicons: new Datastore({
    filename: getPath('storage/favicons.db'),
    autoload: true,
  }),
};
