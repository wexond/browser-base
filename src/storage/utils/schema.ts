import { promises as fs } from 'fs';
import { Database } from 'better-sqlite3';

export const loadSchema = async (path: string, db: Database) => {
  const schema = await fs.readFile(path, 'utf8');

  db.exec(schema);
};
