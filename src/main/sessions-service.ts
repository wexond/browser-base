import { session, ipcMain, app } from 'electron';
import { getPath, makeId } from '~/utils';
import { promises, existsSync } from 'fs';
import { resolve, basename, parse, extname } from 'path';
import { Application } from './application';
import { registerProtocol } from './models/protocol';
import * as url from 'url';
import { IDownloadItem, BrowserActionChangeType } from '~/interfaces';
import { parseCrx } from '~/utils/crx';
import { pathExists } from '~/utils/files';
import { extractZip } from '~/utils/zip';
import { extensions, _setFallbackSession } from 'electron-extensions';
import { requestPermission } from './dialogs/permissions';

// TODO: sessions should be separate.  This structure actually doesn't make sense.
export class SessionsService {
  public view = session.fromPartition('persist:view');
  public viewIncognito = session.fromPartition('view_incognito');

  public incognitoExtensionsLoaded = false;
  public extensionsLoaded = false;

  public extensions: Electron.Extension[] = [];

  public constructor() {
    registerProtocol(this.view);
    registerProtocol(this.viewIncognito);

    this.clearCache('incognito');

    if (process.env.ENABLE_EXTENSIONS) {
      // TODO: remove this after fix for e.sender.session
      _setFallbackSession(this.view);

      extensions.initializeSession(
        this.view,
        `${app.getAppPath()}/build/extensions-preload.bundle.js`,
      );

      ipcMain.on('load-extensions', () => {
        this.loadExtensions();
      });

      ipcMain.handle('get-extensions', () => {
        return this.extensions;
      });
    }

    /*
    // TODO:
    ipcMain.handle(`inspect-extension`, (e, incognito, id) => {
      const context = incognito ? this.extensionsIncognito : this.extensions;
      context.extensions[id].backgroundPage.webContents.openDevTools();
    });
    */

    this.view.setPermissionRequestHandler(
      async (webContents, permission, callback, details) => {
        const window = Application.instance.windows.findByBrowserView(
          webContents.id,
        );

        if (webContents.id !== window.viewManager.selectedId) return;

        if (permission === 'fullscreen') {
          callback(true);
        } else {
          try {
            const { hostname } = url.parse(details.requestingUrl);
            const perm: any = await Application.instance.storage.findOne({
              scope: 'permissions',
              query: {
                url: hostname,
                permission,
                mediaTypes: JSON.stringify(details.mediaTypes) || '',
              },
            });

            if (!perm) {
              const response = await requestPermission(
                window.win,
                permission,
                webContents.getURL(),
                details,
                webContents.id,
              );

              callback(response);

              await Application.instance.storage.insert({
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

    const downloadsDialog = () =>
      Application.instance.dialogs.getDynamic('downloads-dialog')?.browserView
        ?.webContents;

    const downloads: IDownloadItem[] = [];

    ipcMain.handle('get-downloads', () => {
      return downloads;
    });

    // TODO(sentialx): clean up the download listeners
    this.view.on('will-download', (event, item, webContents) => {
      const fileName = item.getFilename();
      const id = makeId(32);
      const window = Application.instance.windows.findByBrowserView(
        webContents.id,
      );

      if (!Application.instance.settings.object.downloadsDialog) {
        const downloadsPath =
          Application.instance.settings.object.downloadsPath;
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
      downloads.push(downloadItem);

      downloadsDialog()?.send('download-started', downloadItem);
      window.send('download-started', downloadItem);

      item.on('updated', (event, state) => {
        if (state === 'interrupted') {
          console.log('Download is interrupted but can be resumed');
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            console.log('Download is paused');
          }
        }

        const data = getDownloadItem(item, id);

        downloadsDialog()?.send('download-progress', data);
        window.send('download-progress', data);

        Object.assign(downloadItem, data);
      });
      item.once('done', async (event, state) => {
        if (state === 'completed') {
          const dialog = downloadsDialog();
          dialog?.send('download-completed', id);
          window.send('download-completed', id, !!dialog);

          downloadItem.completed = true;

          if (process.env.ENABLE_EXTENSIONS && extname(fileName) === '.crx') {
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

            const extension = await this.view.loadExtension(path);

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

            window.send('load-browserAction', extension);
          }
        } else {
          console.log(`Download failed: ${state}`);
        }
      });
    });

    session.defaultSession.on('will-download', (event, item, webContents) => {
      const id = makeId(32);
      const window = Application.instance.windows.list.find(
        (x) => x && x.webContents.id === webContents.id,
      );

      const downloadItem = getDownloadItem(item, id);
      downloads.push(downloadItem);

      downloadsDialog()?.send('download-started', downloadItem);
      window.send('download-started', downloadItem);

      item.on('updated', (event, state) => {
        if (state === 'interrupted') {
          console.log('Download is interrupted but can be resumed');
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            console.log('Download is paused');
          }
        }

        const data = getDownloadItem(item, id);

        Object.assign(downloadItem, data);

        downloadsDialog()?.send('download-progress', data);
        window.send('download-progress', data);
      });
      item.once('done', async (event, state) => {
        const dialog = downloadsDialog();
        if (state === 'completed') {
          dialog?.send('download-completed', id);
          window.send('download-completed', id, !!dialog);

          downloadItem.completed = true;
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

  public unloadIncognitoExtensions() {
    /*
    TODO(sentialx): unload incognito extensions
    this.incognitoExtensionsLoaded = false;
    */
  }

  // Loading extensions in an off the record BrowserContext is not supported.
  public async loadExtensions() {
    if (!process.env.ENABLE_EXTENSIONS) return;

    const context = this.view;

    if (this.extensionsLoaded) return;

    const extensionsPath = getPath('extensions');
    const dirs = await promises.readdir(extensionsPath);

    for (const dir of dirs) {
      try {
        const path = resolve(extensionsPath, dir);
        const extension = await context.loadExtension(path);

        this.extensions.push(extension);

        for (const window of Application.instance.windows.list) {
          window.send('load-browserAction', extension);
        }
      } catch (e) {
        console.error(e);
      }
    }

    /*if (session === 'incognito') {
      this.incognitoExtensionsLoaded = true;
    }*/

    this.extensionsLoaded = true;
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
