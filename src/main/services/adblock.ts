import { Session } from 'electron';
import { existsSync, promises as fs } from 'fs';
import { resolve } from 'path';
import fetch from 'node-fetch';

import { windowsManager } from '..';
import { ElectronBlocker, Request } from '@cliqz/adblocker-electron';
import { getPath } from '~/utils';

export let engine: ElectronBlocker;

const loadFilters = async () => {
  const path = resolve(getPath('adblock/cache.dat'));

  const downloadFilters = async () => {
    // Load lists to perform ads and tracking blocking:
    //
    //  - https://easylist.to/easylist/easylist.txt
    //  - https://pgl.yoyo.org/adservers/serverlist.php?hostformat=adblockplus&showintro=1&mimetype=plaintext
    //  - https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/resource-abuse.txt
    //  - https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/badware.txt
    //  - https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt
    //  - https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/unbreak.txt
    //
    //  - https://easylist.to/easylist/easyprivacy.txt
    //  - https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/privacy.txt
    engine = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch);

    try {
      await fs.writeFile(path, engine.serialize());
    } catch (err) {
      if (err) return console.error(err);
    }
  };

  if (existsSync(path)) {
    try {
      const buffer = await fs.readFile(resolve(path));

      try {
        engine = ElectronBlocker.deserialize(buffer);
      } catch (e) {
        return downloadFilters();
      }
    } catch (err) {
      return console.error(err);
    }
  } else {
    return downloadFilters();
  }
};

export const runAdblockService = (ses: Session) => {
  const emitBlockedEvent = (request: Request) => {
    for (const window of windowsManager.list) {
      window.webContents.send(`blocked-ad-${request.tabId}`);
    }
  };

  loadFilters().then(() => {
    engine.enableBlockingInSession(ses);
    engine.on('request-blocked', emitBlockedEvent);
    engine.on('request-redirected', emitBlockedEvent);
  });
};
