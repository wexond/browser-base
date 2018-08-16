import Datastore from 'nedb';
import { BookmarkItem, Favicon, HistoryItem } from './interfaces';

export const Database = {
  test: new Datastore({ filename: 'test.db', autoload: true }),
};

export default Database;
