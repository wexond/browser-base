import sqlite3 from 'sqlite3';

import { getPath } from './paths';

export const history = new sqlite3.Database(getPath('history.db'));
export const favicons = new sqlite3.Database(getPath('favicons.db'));

history.run('CREATE TABLE IF NOT EXISTS history(id INTEGER PRIMARY KEY, title TEXT, url TEXT, favicon TEXT, date TEXT)');
favicons.run('CREATE TABLE IF NOT EXISTS favicons(id INTEGER PRIMARY KEY, url TEXT, favicon BLOB)');

export interface Favicon {
  url: string;
  favicon: Buffer;
}

export interface HistoryItem {
  date: string;
  favicon: string;
  title: string;
  url: string;
}

export const addFavicon = (url: string) => {
  fetch(url)
    .then(res => res.blob())
    .then((blob) => {
      const reader = new FileReader();
      reader.onload = () => {
        const generatedBuffer = reader.result;

        favicons.run(
          'INSERT INTO favicons(url, favicon) SELECT ?, ? WHERE NOT EXISTS(SELECT 1 FROM favicons WHERE url = ?)',
          [url, Buffer.from(generatedBuffer), url],
        );
      };
      reader.readAsArrayBuffer(blob);
    });
};
