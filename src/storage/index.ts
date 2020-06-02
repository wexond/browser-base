import * as Database from 'better-sqlite3';

const db = new Database('storage.db', { verbose: console.log });

(async () => {
  console.log('Storage loaded');

  const query = db.prepare('SELECT * from history');
  const items = query.run();

  console.log(items);
})();

console.log('XDDDDDDDDDDDDDDDDDDDDDDDDDD');
