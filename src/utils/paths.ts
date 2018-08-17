import path from 'path';
import { remote, app } from 'electron';

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
