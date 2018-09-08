import { resolve } from 'path';
import { remote, app } from 'electron';

export const getPath = (...relativePaths: string[]) => {
  let path: string;

  if (remote) {
    path = remote.app.getPath('userData');
  } else if (app) {
    path = app.getPath('userData');
  } else {
    return null;
  }

  return resolve(path, ...relativePaths).replace(/\\/g, '/');
};
