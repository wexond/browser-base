import path from 'path';
import { USERDATA_PATH } from '../constants/paths';

export const getPath = (relativePath: string) =>
  path.resolve(USERDATA_PATH, relativePath).replace(/\\/g, '/');
