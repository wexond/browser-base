import { existsSync, promises as fs } from 'fs';
import { resolve, join } from 'path';
import fetch from 'node-fetch';

import { ElectronBlocker, Request } from '@cliqz/adblocker-electron';
import { getPath } from '~/utils';
import { Application } from '../application';
import { ipcMain } from 'electron';

export let engine: ElectronBlocker;

const PRELOAD_PATH = join(__dirname, './preload.js');

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
  const win = Application.instance.windows.findByBrowserView(request.tabId);
  if (!win) return;
  win.viewManager.views.get(request.tabId).emitEvent('blocked-ad');
};

let adblockRunning = false;
let adblockInitialized = false;

interface IAdblockInfo {
  headersReceivedId?: number;
  beforeRequestId?: number;
}

const sessionAdblockInfoMap: Map<Electron.Session, IAdblockInfo> = new Map();

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

  const info = sessionAdblockInfoMap.get(ses) || {};

  if (!info.headersReceivedId) {
    info.headersReceivedId = ses.webRequest.addListener(
      'onHeadersReceived',
      { urls: ['<all_urls>'] },
      (engine as any).onHeadersReceived,
      { order: 0 },
    ).id;
  }

  if (!info.beforeRequestId) {
    info.beforeRequestId = ses.webRequest.addListener(
      'onBeforeRequest',
      { urls: ['<all_urls>'] },
      (engine as any).onBeforeRequest,
      { order: 0 },
    ).id;
  }

  sessionAdblockInfoMap.set(ses, info);

  ipcMain.on('get-cosmetic-filters', (engine as any).onGetCosmeticFilters);
  ipcMain.on(
    'is-mutation-observer-enabled',
    (engine as any).onIsMutationObserverEnabled,
  );
  ses.setPreloads(ses.getPreloads().concat([PRELOAD_PATH]));

  engine.on('request-blocked', emitBlockedEvent);
  engine.on('request-redirected', emitBlockedEvent);
};

export const stopAdblockService = (ses: any) => {
  if (!ses.webRequest.removeListener) return;
  if (!adblockRunning) return;

  adblockRunning = false;

  const info = sessionAdblockInfoMap.get(ses) || {};

  if (info.beforeRequestId) {
    ses.webRequest.removeListener('onBeforeRequest', info.beforeRequestId);
    info.beforeRequestId = null;
  }

  if (info.headersReceivedId) {
    ses.webRequest.removeListener('onHeadersReceived', info.headersReceivedId);
    info.headersReceivedId = null;
  }

  ses.setPreloads(ses.getPreloads().filter((p: string) => p !== PRELOAD_PATH));
};
