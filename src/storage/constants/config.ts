import { resolve } from 'path';
import { workerData } from 'worker_threads';

const { storagePath } = workerData;
const buildPath = resolve('build/storage');

export const config = {
  bookmarks: resolve(storagePath, 'bookmarks.json'),
  history: resolve(storagePath, 'history.db'),
  default: {
    bookmarks: resolve(buildPath, 'bookmarks.json'),
    history: resolve(buildPath, 'history.sql'),
  },
};
