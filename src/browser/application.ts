import { app, ipcMain, session } from 'electron';
import { isAbsolute, extname } from 'path';
import { existsSync } from 'fs';
import { checkFiles } from '~/utils/files';
import { isURL, prefixHttp } from '~/utils';
import { WindowsService } from './windows-service';
import { StorageService } from './services/storage';
import { DialogsService } from './services/dialogs-service';
import { requestAuth } from './dialogs/auth';
import { protocols } from './protocols';
import { Tabs } from './tabs';
import { BrowserContext } from './browser-context';

export class Application {
  public static instance = new Application();

  public windows: WindowsService = new WindowsService();

  // public settings = new Settings();
  public tabs = new Tabs();

  public dialogs = new DialogsService();

  public storage: StorageService;

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
              this.windows.current.viewManager.create({
                url: `file:///${path}`,
                active: true,
              });
            }
          }
          return;
        } else if (isURL(path)) {
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

    protocols.forEach((protocol) => protocol?.setPrivileged?.());

    ipcMain.on('create-window', (e, incognito = false) => {
      this.windows.open(incognito);
    });

    this.onReady();
  }

  private async onReady() {
    await app.whenReady();

    checkFiles();

    this.storage = new StorageService();

    const browserContext = await BrowserContext.from(
      session.defaultSession,
      false,
    );

    this.dialogs.run();

    await browserContext.loadExtensions();

    this.windows.create(browserContext, {});

    // Menu.setApplicationMenu(getMainMenu());
    // runAutoUpdaterService();

    app.on('activate', () => {
      if (this.windows.list.filter((x) => x !== null).length === 0) {
        this.windows.open();
      }
    });
  }
}
