import { AppWindow } from './windows';
import { app, Menu, ipcMain, session } from 'electron';
import { isAbsolute, extname } from 'path';
import { existsSync } from 'fs';
import { getMainMenu } from './menus/main';
import { SessionsManager } from './sessions-manager';
import { runAutoUpdaterService } from './services';
import { checkFiles } from '~/utils/files';
import { Settings } from './models/settings';
import { isURL, prefixHttp, requestURL } from '~/utils';
import { registerProtocol } from './models/protocol';
import storage from './services/storage';

export class WindowsManager {
  public list: AppWindow[] = [];

  public currentWindow: AppWindow;

  public sessionsManager: SessionsManager;

  public settings = new Settings(this);

  public favicons: Map<string, string> = new Map();

  public constructor() {
    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
      app.quit();
    } else {
      app.on('second-instance', async (e, argv) => {
        const path = argv[argv.length - 1];

        if (isAbsolute(path) && existsSync(path)) {
          if (process.env.ENV !== 'dev') {
            const path = argv[argv.length - 1];
            const ext = extname(path);

            if (ext === '.html') {
              this.currentWindow.webContents.send('api-tabs-create', {
                url: `file:///${path}`,
                active: true,
              });
            }
          }
          return;
        } else if (isURL(path)) {
          this.currentWindow.viewManager.create({
            url: prefixHttp(path),
            active: true,
          });
          return;
        }

        this.createWindow();
      });
    }

    app.on('login', async (e, webContents, request, authInfo, callback) => {
      e.preventDefault();

      const window = this.findWindowByBrowserView(webContents.id);
      const credentials = await window.authWindow.requestAuth(request.url);

      if (credentials) {
        callback(credentials.username, credentials.password);
      }
    });

    ipcMain.on('create-window', (e, incognito = false) => {
      this.createWindow(incognito);
    });

    this.onReady();
  }

  private async onReady() {
    await app.whenReady();

    checkFiles();

    storage.run();

    registerProtocol(session.defaultSession);

    this.sessionsManager = new SessionsManager(this);

    Menu.setApplicationMenu(getMainMenu(this));
    this.createWindow();

    runAutoUpdaterService(this);

    app.on('activate', () => {
      if (this.list.filter(x => x !== null).length === 0) {
        this.createWindow();
      }
    });
  }

  public createWindow(incognito = false) {
    const window = new AppWindow(this, incognito);
    this.list.push(window);

    if (incognito) {
      this.sessionsManager.extensionsIncognito.addWindow(window);
      if (!this.sessionsManager.incognitoExtensionsLoaded) {
        this.sessionsManager.loadExtensions('incognito');
      }
    } else {
      this.sessionsManager.extensions.addWindow(window);
    }
  }

  public findWindowByBrowserView(webContentsId: number) {
    return this.list.find(
      x => !!x.viewManager.views.find(y => y.webContents.id === webContentsId),
    );
  }
}
