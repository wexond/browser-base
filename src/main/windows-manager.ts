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
import { IFavicon } from '~/interfaces';
import fileType = require('file-type');
import icojs = require('icojs');

const convertIcoToPng = (icoData: Buffer) => {
  return new Promise((resolve: (b: Buffer) => void) => {
    icojs.parse(icoData, 'image/png').then((images: any) => {
      resolve(images[0].buffer);
    });
  });
};

const readImage = (buffer: Buffer) => {
  return new Promise((resolve: (b: Buffer) => void) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(Buffer.from(reader.result as any));
    };

    reader.readAsArrayBuffer(new Blob([buffer]));
  });
};

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
              this.currentWindow.viewManager.create({
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
      const credentials = await window.authDialog.requestAuth(request.url);

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
    registerProtocol(session.defaultSession);

    storage.run();

    (await storage.find<IFavicon>({ scope: 'favicons', query: {} })).forEach(
      favicon => {
        const { data } = favicon;

        if (this.favicons.get(favicon.url) == null) {
          this.favicons.set(favicon.url, data);
        }
      },
    );

    this.sessionsManager = new SessionsManager(this);

    this.createWindow();

    console.timeEnd('Main start');

    runAutoUpdaterService(this);

    Menu.setApplicationMenu(getMainMenu(this));

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

  public addFavicon = async (url: string): Promise<string> => {
    return new Promise(async resolve => {
      if (!this.favicons.get(url)) {
        try {
          const res = await requestURL(url);

          if (res.statusCode === 404) {
            throw new Error('404 favicon not found');
          }

          let data = Buffer.from(res.data, 'binary');

          const type = fileType(data);

          if (type && type.ext === 'ico') {
            data = await readImage(await convertIcoToPng(data));
          }

          const str = `data:png;base64,${data.toString('base64')}`;

          storage.insert({
            scope: 'favicons',
            item: {
              url,
              data: str,
            },
          });

          this.favicons.set(url, str);

          resolve(str);
        } catch (e) {
          throw e;
        }
      } else {
        resolve(this.favicons.get(url));
      }
    });
  };
}
