import * as Database from 'better-sqlite3';

const history = new Database('history.db', { verbose: console.log });
