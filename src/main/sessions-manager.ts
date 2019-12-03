import { session, app, ipcMain } from 'electron';
import { ExtensibleSession } from 'electron-extensions/main';
import { getPath, makeId } from '~/utils';
import { promises, existsSync } from 'fs';
import { resolve, basename, parse, extname } from 'path';
import { WindowsManager } from './windows-manager';
import { registerProtocol } from './models/protocol';
import storage from './services/storage';
import * as url from 'url';
import { IDownloadItem } from '~/interfaces';
import { parseCrx } from '~/utils/crx';
import { pathExists } from '~/utils/files';
import { extractZip } from '~/utils/zip';

const extensibleSessionOptions = {
  backgroundPreloadPath: resolve(__dirname, 'extensions-background-preload.js'),
  contentPreloadPath: resolve(__dirname, 'extensions-content-preload.js'),
};

export class SessionsManager {
  public view = session.fromPartition('persist:view');
  public viewIncognito = session.fromPartition('view_incognito');

  public extensions = new ExtensibleSession(
    this.view,
    extensibleSessionOptions,
  );
  public extensionsIncognito = new ExtensibleSession(
    this.viewIncognito,
    extensibleSessionOptions,
  );

  public incognitoExtensionsLoaded = false;

  private windowsManager: WindowsManager;

  public constructor(windowsManager: WindowsManager) {
    this.windowsManager = windowsManager;

    this.loadExtensions('normal');

    registerProtocol(this.view);
    registerProtocol(this.viewIncognito);

    this.clearCache('incognito');

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
              const response = await window.permissionsDialog.requestPermission(
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

    this.view.on('will-download', (event, item, webContents) => {
      const downloadsPath = app.getPath('downloads');
      const fileName = item.getFilename();
      let savePath = resolve(downloadsPath, fileName);
      const id = makeId(32);
      const window = windowsManager.findWindowByBrowserView(webContents.id);

      let i = 1;

      while (existsSync(savePath)) {
        const { name, ext } = parse(fileName);
        savePath = resolve(downloadsPath, `${name} (${i})${ext}`);
        i++;
      }

      item.savePath = savePath;

      const downloadItem: IDownloadItem = {
        fileName: basename(savePath),
        receivedBytes: 0,
        totalBytes: item.getTotalBytes(),
        savePath,
        id,
      };

      window.downloadsDialog.webContents.send('download-started', downloadItem);
      window.webContents.send('download-started', downloadItem);

      item.on('updated', (event, state) => {
        if (state === 'interrupted') {
          console.log('Download is interrupted but can be resumed');
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            console.log('Download is paused');
          } else {
            const data = {
              id,
              receivedBytes: item.getReceivedBytes(),
            };

            window.downloadsDialog.webContents.send('download-progress', data);
            window.webContents.send('download-progress', data);
          }
        }
      });
      item.once('done', async (event, state) => {
        if (state === 'completed') {
          window.downloadsDialog.webContents.send('download-completed', id);
          window.webContents.send(
            'download-completed',
            id,
            !window.downloadsDialog.visible,
          );

          if (extname(fileName) === '.crx') {
            const crxBuf = await promises.readFile(savePath);
            const crxInfo = parseCrx(crxBuf);

            if (!crxInfo.id) {
              crxInfo.id = makeId(32);
            }

            const extensionsPath = getPath('extensions');
            const path = resolve(extensionsPath, crxInfo.id);

            if (await pathExists(path)) {
              console.log('Extension is already installed');
              return;
            }

            await extractZip(crxInfo.zip, path);

            const extension = {
              ...(await this.extensions.loadExtension(path)),
            };

            delete extension.backgroundPage;

            window.webContents.send('load-browserAction', extension);
          }
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

  public async loadExtensions(session: 'normal' | 'incognito') {
    const context =
      session === 'incognito' ? this.extensionsIncognito : this.extensions;

    const extensionsPath = getPath('extensions');
    const dirs = await promises.readdir(extensionsPath);

    for (const dir of dirs) {
      context.loadExtension(resolve(extensionsPath, dir));
    }

    context.loadExtension(resolve(__dirname, 'extensions/wexond-darkreader'));

    if (session === 'incognito') {
      this.incognitoExtensionsLoaded = true;
    }
  }
}
