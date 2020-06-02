import * as Database from 'better-sqlite3';

export const db: Database.Database = new Database('storage.db', {
  verbose: console.log,
});
