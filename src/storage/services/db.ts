import { config } from '../constants';
import BookmarksService from './bookmarks';
import HistoryService from './history';
import FaviconsService from './favicons';
import { Database } from '../database';

class DbService {
  public history: Database;

  public favicons: Database;

  public async start() {
    this.history = new Database(config.history, config.default.history);
    this.favicons = new Database(config.favicons, config.default.favicons);

    await BookmarksService.start();

    HistoryService.start();
    FaviconsService.start();
  }
}

export default new DbService();
