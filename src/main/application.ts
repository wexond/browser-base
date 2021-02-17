import { app, ipcMain, Menu } from 'electron';
import { isAbsolute, extname } from 'path';
import { existsSync } from 'fs';
import { SessionsService } from './sessions-service';
import { checkFiles } from '~/utils/files';
import { Settings } from './models/settings';
import { isURL, prefixHttp } from '~/utils';
import { WindowsService } from './windows-service';
import { StorageService } from './services/storage';
import { getMainMenu } from './menus/main';
import { runAutoUpdaterService } from './services';
import { DialogsService } from './services/dialogs-service';
import { requestAuth } from './dialogs/auth';
import { NetworkServiceHandler } from './network/network-service-handler';
import { ExtensionServiceHandler } from './extension-service-handler';

export class Application {
  public static instance = new Application();

  public sessions: SessionsService;

  public settings = new Settings();

  public storage = new StorageService();

  public windows = new WindowsService();

  public dialogs = new DialogsService();

  public start() {
    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
      app.quit();
      return;
    } else {
      app.on('second-instance', async (e, argv) => {
        const path = argv[argv.length - 1];

        if (isAbsolute(path) && existsSync(path)) {
          if (process.env.NODE_ENV !== 'development') {
            const path = argv[argv.length - 1];
            const ext = extname(path);

            if (ext === '.html') {
              this.windows.current.win.focus();
              this.windows.current.viewManager.create({
                url: `file:///${path}`,
                active: true,
              });
            }
          }
          return;
        } else if (isURL(path)) {
          this.windows.current.win.focus();
          this.windows.current.viewManager.create({
            url: prefixHttp(path),
            active: true,
          });
          return;
        }

        this.windows.open();
      });
    }

    app.on('login', async (e, webContents, request, authInfo, callback) => {
      e.preventDefault();

      const window = this.windows.findByBrowserView(webContents.id);
      const credentials = await requestAuth(
        window.win,
        request.url,
        webContents.id,
      );

      if (credentials) {
        callback(credentials.username, credentials.password);
      }
    });

    ipcMain.on('create-window', (e, incognito = false) => {
      this.windows.open(incognito);
    });

    this.onReady();
  }

  private async onReady() {
    await app.whenReady();

    new ExtensionServiceHandler();

    NetworkServiceHandler.get();

    checkFiles();

    this.storage.run();
    this.dialogs.run();

    this.windows.open();

    this.sessions = new SessionsService();

    Menu.setApplicationMenu(getMainMenu());
    runAutoUpdaterService();

    app.on('activate', () => {
      if (this.windows.list.filter((x) => x !== null).length === 0) {
        this.windows.open();
      }
    });
  }
}
