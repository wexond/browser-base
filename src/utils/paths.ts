import path from 'path';

export const getPath = (...relativePaths: string[]) => {
  const { app, remote } = require('electron');

  if (remote) {
    return path
      .resolve(remote.app.getPath('userData'), ...relativePaths)
      .replace(/\\/g, '/');
  }
  return path
    .resolve(app.getPath('userData'), ...relativePaths)
    .replace(/\\/g, '/');
};
