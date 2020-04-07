import { existsSync, promises as fs } from 'fs';
import { resolve } from 'path';
import fetch from 'node-fetch';

import { ElectronBlocker, Request } from '@cliqz/adblocker-electron';
import { getPath } from '~/utils';
import { Application } from '../application';

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

const emitBlockedEvent = (request: Request) => {
  for (const window of Application.instance.windows.list) {
    window.viewManager.views.get(request.tabId).emitEvent('blocked-ad');
  }
};

let adblockRunning = false;
let adblockInitialized = false;

export const runAdblockService = async (ses: any) => {
  if (!adblockInitialized) {
    adblockInitialized = true;
    await loadFilters();
  }

  if (adblockInitialized && !engine) {
    return;
  }

  if (adblockRunning) return;

  adblockRunning = true;

  engine.enableBlockingInSession(ses);

  engine.on('request-blocked', emitBlockedEvent);
  engine.on('request-redirected', emitBlockedEvent);
};

export const stopAdblockService = (ses: any) => {
  if (!adblockRunning) return;

  adblockRunning = false;

  if (engine) {
    engine.disableBlockingInSession(ses);
  }
};
