import { resolve } from 'path';
import { workerData } from 'worker_threads';

const { storagePath } = workerData;
const buildPath = resolve('build/storage');

export const config = {
  dbPath: 'storage.db',
  schemaPath: resolve('build/storage/schema.sql'),
  bookmarks: resolve(storagePath, 'bookmarks.json'),
  default: {
    bookmarks: resolve(buildPath, 'bookmarks.json'),
  },
};
