import { app, remote } from 'electron';
import path from 'path';

export const getPath = (...relativePaths: string[]) => {
  if (remote) {
    return path
      .resolve(remote.app.getPath('userData'), ...relativePaths)
      .replace(/\\/g, '/');
  }
  return path
    .resolve(app.getPath('userData'), ...relativePaths)
    .replace(/\\/g, '/');
};

export const isPathFile = (file: string) => {
  return path.extname(file) !== '';
};
