import Datastore from 'nedb';

export const databases = {
  history: new Datastore({ filename: 'history.db', autoload: true }),
  bookmarks: new Datastore({ filename: 'bookmarks.db', autoload: true }),
  favicons: new Datastore({ filename: 'favicons.db', autoload: true }),
};
