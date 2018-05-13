import path from 'path';
import { USERDATA_PATH } from '../constants/paths';

export const getPath = (...relativePaths: string[]) =>
  path.resolve(USERDATA_PATH, ...relativePaths).replace(/\\/g, '/');
