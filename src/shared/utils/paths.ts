import path from 'path';
import { remote } from 'electron';

const { app } = remote;

export const getPath = (...relativePaths: string[]) =>
  path.resolve(app.getPath('userData'), ...relativePaths).replace(/\\/g, '/');
