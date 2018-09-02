import Datastore from 'nedb';

import { defaultPaths } from '~/defaults/paths';
import { getPath } from '~/utils/paths';

export const databases = {
  history: new Datastore({
    filename: getPath(defaultPaths.storage, 'history.db'),
    autoload: true,
  }),
  bookmarks: new Datastore({
    filename: getPath(defaultPaths.storage, 'bookmarks.db'),
    autoload: true,
  }),
  favicons: new Datastore({
    filename: getPath(defaultPaths.storage, 'favicons.db'),
    autoload: true,
  }),
};
