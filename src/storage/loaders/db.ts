import * as Database from 'better-sqlite3';

import { config } from '../constants';
import { pathExists } from '~/common/utils/files';
import { loadSchema } from '../utils';
import BookmarksService from '../services/bookmark';

export let db: Database.Database;

export default async () => {
  const exists = await pathExists(config.dbPath);

  db = new Database(config.dbPath, {
    verbose: console.log,
  });

  if (!exists) {
    await loadSchema(config.schemaPath, db);
  }

  await BookmarksService.load();
};
