import { existsSync, readFileSync } from 'fs-extra'
import { homedir } from 'os';
import { resolve, join } from 'path';
const electron = require('electron');

export function getMigrateUserPreferences(): object | null {
  try {
    debugger
    const userDataPath: string = (electron.app || electron.remote.app).getPath('userData');
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    const oldPath = join(userDataPath, '../flowrclient', 'user-preferences.json');
    if (existsSync(oldPath)) {
      const oldUserPreferences = JSON.parse(readFileSync(oldPath) as any)
      const extUrl = oldUserPreferences.extUrl.url
      const isKiosk = oldUserPreferences.extUrl.isKiosk
      return Object.assign(oldUserPreferences, { extUrl, isKiosk })
    }
  }  catch (err) {
    debugger
  }
  return null
}
