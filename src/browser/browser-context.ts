import { protocols } from './protocols';
import { hookBrowserContextEvents } from './browser-context-events';
import { _setFallbackSession } from './extensions/session';
import { app, ipcMain } from 'electron';
import { extensions } from './extensions';
import { WindowsService } from './windows-service';
import { Application } from './application';

export class BrowserContext {
  public session: Electron.Session;

  public extensions: Electron.Extension[] = [];

  constructor(session: Electron.Session, offTheRecord: boolean) {
    this.session = session;

    protocols.forEach((protocol) => protocol?.register?.(session));

    // TODO: remove this after fix for e.sender.session
    _setFallbackSession(session);

    extensions.initializeSession(
      session,
      `${app.getAppPath()}/build/api-preload.bundle.js`,
    );

    Application.instance.windows.create(this);

    if (process.env.ENABLE_EXTENSIONS && !offTheRecord) {
      // ipcMain.on('load-extensions', () => {
      //   this.loadExtensions();
      // });

      ipcMain.handle('get-extensions', () => {
        return this.extensions;
      });
    }

    // hookBrowserContextEvents(this);
  }

  public async loadExtensions() {
    // TODO: sandbox
    // if (!process.env.ENABLE_EXTENSIONS) return;
    // const context = this.view;
    // if (this.extensionsLoaded) return;
    // const extensionsPath = getPath('extensions');
    // const dirs = await promises.readdir(extensionsPath);
    // for (const dir of dirs) {
    //   try {
    //     const path = resolve(extensionsPath, dir);
    //     const extension = await context.loadExtension(path);
    //     this.extensions.push(extension);
    //     for (const window of Application.instance.windows.list) {
    //       window.send('load-browserAction', extension);
    //     }
    //   } catch (e) {
    //     console.error(e);
    //   }
    // }
    // this.extensionsLoaded = true;
  }
}
