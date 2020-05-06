import { session, ipcMain, app } from 'electron';
import { getPath, makeId } from '~/utils';
import { promises, existsSync } from 'fs';
import { resolve, basename, parse, extname } from 'path';
import { Application } from './application';
import { registerProtocol } from './models/protocols';
import * as url from 'url';
import { IDownloadItem, BrowserActionChangeType } from '~/interfaces';
import { parseCrx } from '~/utils/crx';
import { pathExists } from '~/utils/files';
import { extractZip } from '~/utils/zip';
import { extensions, _setFallbackSession } from 'electron-extensions';
import { requestPermission } from './dialogs/permissions';
import { BrowserContext } from './browser-context';

// TODO: move windows list to the corresponding sessions
export class BrowserContexts {
  public browserContexts: Set<BrowserContext> = new Set();

  public constructor() {
    // this.clearCache('incognito');

    /*
    // TODO:
    ipcMain.handle(`inspect-extension`, (e, incognito, id) => {
      const context = incognito ? this.extensionsIncognito : this.extensions;
      context.extensions[id].backgroundPage.webContents.openDevTools();
    });
    */

    ipcMain.on('clear-browsing-data', () => {
      this.clearCache('normal');
      this.clearCache('incognito');
    });
  }

  public create(session: Electron.Session, offTheRecord: boolean) {
    const browserContext = new BrowserContext(session, offTheRecord);
    this.browserContexts.add(browserContext);
  }

  public clearCache(session: 'normal' | 'incognito') {
    const ses = session === 'incognito' ? this.viewIncognito : this.view;

    ses.clearCache().catch((err) => {
      console.error(err);
    });

    ses.clearStorageData({
      storages: [
        'appcache',
        'cookies',
        'filesystem',
        'indexdb',
        'localstorage',
        'shadercache',
        'websql',
        'serviceworkers',
        'cachestorage',
      ],
    });
  }

  public onCreateTab = async (details: chrome.tabs.CreateProperties) => {
    const view = Application.instance.windows.list
      .find((x) => x.win.id === details.windowId)
      .viewManager.create(details, false, true);

    return view.id;
  };

  public onBrowserActionUpdate = (
    extensionId: string,
    action: BrowserActionChangeType,
    details: any,
  ) => {
    Application.instance.windows.list.forEach((w) => {
      w.send('set-browserAction-info', extensionId, action, details);
    });
  };
}
