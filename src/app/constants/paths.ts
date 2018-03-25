import { homedir } from 'os';
import path from 'path';

export const USERDATA_PATH = path.resolve(homedir(), '.wexond');
