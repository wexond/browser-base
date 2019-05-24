import { existsSync, readFileSync } from 'fs-extra'
import { homedir } from 'os';
import { resolve, join } from 'path';
const electron = require('electron');

let dataToImport: any;
export function shouldMigrate(): boolean {
  const app = electron.app || electron.remote && electron.remote.app
  const userDataPath: string = (electron.app || electron.remote.app).getPath('userData');
  // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
  const oldPath = join(userDataPath, 'user-preferences.json');
  let result: boolean = true
  if (existsSync(oldPath)) {
    result = ! existsSync(resolve(homedir(), '.flowr-electron'))
  }
  dataToImport = JSON.parse(readFileSync(oldPath) as any)
  const exrUrl =
  return result
}
