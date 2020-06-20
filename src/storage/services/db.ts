import * as sqlite from 'better-sqlite3';
import { Database } from 'better-sqlite3';
import { promises as fs } from 'fs';

import { pathExists } from '~/common/utils/files';
import { config } from '../constants';
import BookmarksService from './bookmarks';
import HistoryService from './history';
import FaviconsService from './favicons';

class DbService {
  public history: Database;

  public favicons: Database;

  public async start() {
    this.history = await this.createDb(config.history, config.default.history);

    this.favicons = await this.createDb(
      config.favicons,
      config.default.favicons,
    );

    await BookmarksService.start();

    HistoryService.start();
    FaviconsService.start();
  }

  private async createDb(path: string, schemaPath: string) {
    const exists = await pathExists(path);

    const db = sqlite(path, {/* verbose: console.log*/ });

    if (!exists) {
      const schema = await fs.readFile(schemaPath, 'utf8');

      db.exec(schema);

      console.log(`Database created at ${path}`);
    }

    return db;
  }
}

export default new DbService();
