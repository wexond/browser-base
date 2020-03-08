import { session, ipcMain, app } from 'electron';
import { getPath, makeId } from '~/utils';
import { promises, existsSync } from 'fs';
import { resolve, basename, parse, extname } from 'path';
import { WindowsManager } from './windows-manager';
import { registerProtocol } from './models/protocol';
import storage from './services/storage';
import * as url from 'url';
import {
  IDownloadItem,
  BrowserActionChangeType,
  Electron10Extension,
} from '~/interfaces';
import { parseCrx } from '~/utils/crx';
import { pathExists } from '~/utils/files';
import { extractZip } from '~/utils/zip';
import { runExtensionsMessagingService } from './services/extensions-messaging';
import { hookWebContentsEvents } from './services/web-navigation';

// TODO(sentialx): remove this after upgrading to Electron 10:
const getElectron10Extension = async (
  session: Electron.Session,
  path: string,
) => {
  return {
    ...(await session.loadExtension(path)),
    path,
    manifest: JSON.parse(
      await promises.readFile(resolve(path, 'manifest.json'), 'utf8'),
    ),
  };
};

// TODO: move windows list to the corresponding sessions
export class SessionsManager {
  public view = session.fromPartition('persist:view');
  public viewIncognito = session.fromPartition('view_incognito');

  public incognitoExtensionsLoaded = false;
  public extensionsLoaded = false;

  public extensions: Electron10Extension[] = [];

  private windowsManager: WindowsManager;

  public constructor(windowsManager: WindowsManager) {
    this.windowsManager = windowsManager;

    this.view.setPreloads([
      ...this.view.getPreloads(),
      `${app.getAppPath()}/build/extensions-preload.bundle.js`,
    ]);

    this.view.cookiesChangedTargets = new Map();
    this.viewIncognito.cookiesChangedTargets = new Map();

    registerProtocol(this.view);
    registerProtocol(this.viewIncognito);

    runExtensionsMessagingService(this);

    app.on('web-contents-created', (e, webContents) => {
      if (
        webContents.getType() !== 'browserView' ||
        webContents.session !== this.view
      )
        return;

      hookWebContentsEvents(this.view, webContents);
    });

    this.view.cookies.on(
      'changed',
      (e: any, cookie: Electron.Cookie, cause: string) => {
        this.view.cookiesChangedTargets.forEach(value => {
          value.send(`api-emit-event-cookies-onChanged`, cookie, cause);
        });
      },
    );

    this.clearCache('incognito');

    ipcMain.on('load-extensions', () => {
      this.loadExtensions();
    });

    ipcMain.handle('get-extensions', () => {
      return this.extensions;
    });

    /*
    // TODO:
    ipcMain.handle(`inspect-extension`, (e, incognito, id) => {
      const context = incognito ? this.extensionsIncognito : this.extensions;
      context.extensions[id].backgroundPage.webContents.openDevTools();
    });
    */

    this.view.setPermissionRequestHandler(
      async (webContents, permission, callback, details) => {
        const window = windowsManager.findWindowByBrowserView(webContents.id);

        if (webContents.id !== window.viewManager.selectedId) return;

        if (permission === 'fullscreen') {
          callback(true);
        } else {
          try {
            const { hostname } = url.parse(details.requestingUrl);
            const perm: any = await storage.findOne({
              scope: 'permissions',
              query: {
                url: hostname,
                permission,
                mediaTypes: JSON.stringify(details.mediaTypes) || '',
              },
            });

            if (!perm) {
              const response = await window.dialogs.permissionsDialog.requestPermission(
                permission,
                webContents.getURL(),
                details,
              );

              callback(response);

              await storage.insert({
                scope: 'permissions',
                item: {
                  url: hostname,
                  permission,
                  type: response ? 1 : 2,
                  mediaTypes: JSON.stringify(details.mediaTypes) || '',
                },
              });
            } else {
              callback(perm.type === 1);
            }
          } catch (e) {
            callback(false);
          }
        }
      },
    );

    const getDownloadItem = (
      item: Electron.DownloadItem,
      id: string,
    ): IDownloadItem => ({
      fileName: basename(item.savePath),
      receivedBytes: item.getReceivedBytes(),
      totalBytes: item.getTotalBytes(),
      savePath: item.savePath,
      id,
    });

    // TODO(sentialx): clean up the download listeners
    this.view.on('will-download', (event, item, webContents) => {
      const fileName = item.getFilename();
      const id = makeId(32);
      const window = windowsManager.findWindowByBrowserView(webContents.id);

      if (!windowsManager.settings.object.downloadsDialog) {
        const downloadsPath = windowsManager.settings.object.downloadsPath;
        let i = 1;
        let savePath = resolve(downloadsPath, fileName);

        while (existsSync(savePath)) {
          const { name, ext } = parse(fileName);
          savePath = resolve(downloadsPath, `${name} (${i})${ext}`);
          i++;
        }

        item.savePath = savePath;
      }

      const downloadItem = getDownloadItem(item, id);

      window.dialogs.downloadsDialog.webContents.send(
        'download-started',
        downloadItem,
      );
      window.webContents.send('download-started', downloadItem);

      item.on('updated', (event, state) => {
        if (state === 'interrupted') {
          console.log('Download is interrupted but can be resumed');
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            console.log('Download is paused');
          }
        }

        const data = getDownloadItem(item, id);

        window.dialogs.downloadsDialog.webContents.send(
          'download-progress',
          data,
        );
        window.webContents.send('download-progress', data);
      });
      item.once('done', async (event, state) => {
        if (state === 'completed') {
          window.dialogs.downloadsDialog.webContents.send(
            'download-completed',
            id,
          );
          window.webContents.send(
            'download-completed',
            id,
            !window.dialogs.downloadsDialog.visible,
          );

          if (extname(fileName) === '.crx') {
            const crxBuf = await promises.readFile(item.savePath);
            const crxInfo = parseCrx(crxBuf);

            if (!crxInfo.id) {
              crxInfo.id = makeId(32);
            }

            const extensionsPath = getPath('extensions');
            const path = resolve(extensionsPath, crxInfo.id);
            const manifestPath = resolve(path, 'manifest.json');

            if (await pathExists(path)) {
              console.log('Extension is already installed');
              return;
            }

            await extractZip(crxInfo.zip, path);

            const extension = await getElectron10Extension(this.view, path);

            if (crxInfo.publicKey) {
              const manifest = JSON.parse(
                await promises.readFile(manifestPath, 'utf8'),
              );

              manifest.key = crxInfo.publicKey.toString('base64');

              await promises.writeFile(
                manifestPath,
                JSON.stringify(manifest, null, 2),
              );
            }

            window.webContents.send('load-browserAction', extension);
          }
        } else {
          console.log(`Download failed: ${state}`);
        }
      });
    });

    session.defaultSession.on('will-download', (event, item, webContents) => {
      const id = makeId(32);
      const window = windowsManager.list.find(
        x => x && x.webContents.id === webContents.id,
      );

      const downloadItem = getDownloadItem(item, id);

      window.dialogs.downloadsDialog.webContents.send(
        'download-started',
        downloadItem,
      );
      window.webContents.send('download-started', downloadItem);

      item.on('updated', (event, state) => {
        if (state === 'interrupted') {
          console.log('Download is interrupted but can be resumed');
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            console.log('Download is paused');
          }
        }

        const data = getDownloadItem(item, id);

        window.dialogs.downloadsDialog.webContents.send(
          'download-progress',
          data,
        );
        window.webContents.send('download-progress', data);
      });
      item.once('done', async (event, state) => {
        if (state === 'completed') {
          window.dialogs.downloadsDialog.webContents.send(
            'download-completed',
            id,
          );
          window.webContents.send(
            'download-completed',
            id,
            !window.dialogs.downloadsDialog.visible,
          );
        } else {
          console.log(`Download failed: ${state}`);
        }
      });
    });

    ipcMain.on('clear-browsing-data', () => {
      this.clearCache('normal');
      this.clearCache('incognito');
    });
  }

  public clearCache(session: 'normal' | 'incognito') {
    const ses = session === 'incognito' ? this.viewIncognito : this.view;

    ses.clearCache().catch(err => {
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

  public unloadIncognitoExtensions() {
    /*
    TODO(sentialx): unload incognito extensions
    this.incognitoExtensionsLoaded = false;
    */
  }

  public async loadExtensions() {
    const context = this.view;

    if (this.extensionsLoaded) return;

    const extensionsPath = getPath('extensions');
    const dirs = await promises.readdir(extensionsPath);

    for (const dir of dirs) {
      try {
        const path = resolve(extensionsPath, dir);
        // TODO(sentialx): after upgrading to Electron 10:
        // const extension = await context.loadExtension(path);
        const extension = await getElectron10Extension(context, path);

        this.extensions.push(extension);

        for (const window of this.windowsManager.list) {
          window.webContents.send('load-browserAction', extension);
        }
      } catch (e) {
        console.error(e);
      }
    }

    /*await context.loadExtension(
      resolve(__dirname, 'extensions/wexond-darkreader'),
    );*/

    /*if (session === 'incognito') {
      this.incognitoExtensionsLoaded = true;
    }*/

    this.extensionsLoaded = true;
  }

  public onCreateTab = async (details: chrome.tabs.CreateProperties) => {
    const view = this.windowsManager.list
      .find(x => x.id === details.windowId)
      .viewManager.create(details, false, true);

    return view.webContents.id;
  };

  public onBrowserActionUpdate = (
    extensionId: string,
    action: BrowserActionChangeType,
    details: any,
  ) => {
    this.windowsManager.list.forEach(w => {
      w.webContents.send(
        'set-browserAction-info',
        extensionId,
        action,
        details,
      );
    });
  };
}
