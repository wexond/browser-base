import * as sqlite from 'better-sqlite3';
import { Database as SqliteDatabase } from 'better-sqlite3';
import { pathExists } from '~/common/utils/files';
import { promises } from 'fs';

export class Database {
  private _db: SqliteDatabase;

  private statements: Map<string, sqlite.Statement> = new Map();

  public transaction = this._db.transaction;

  constructor(path: string, schemaPath: string, verbose = false) {
    this.init(path, schemaPath, verbose);
  }

  private async init(path: string, schemaPath: string, verbose: boolean) {
    const exists = await pathExists(path);

    const db = sqlite(path, { verbose: verbose ? console.log : undefined });

    if (!exists) {
      const schema = await promises.readFile(schemaPath, 'utf8');

      db.exec(schema);

      console.log(`Database created at ${path}`);
    }

    this._db = db;
  }

  public getCachedStatement(sql: string) {
    if (!this.statements.has(sql))
      this.statements.set(sql, this._db.prepare(sql));
    return this.statements.get(sql);
  }
}
