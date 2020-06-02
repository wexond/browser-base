import { protocols } from './protocols';
import { app, ipcMain } from 'electron';
import { extensions } from './extensions';
import { getPath } from '~/utils/paths';
import { promises } from 'fs';
import { resolve } from 'path';

export class BrowserContext {
  private static browserContexts: Map<
    Electron.Session,
    BrowserContext
  > = new Map();

  public session: Electron.Session;

  private offTheRecord = false;

  constructor(session: Electron.Session, offTheRecord: boolean) {
    this.session = session;
    this.offTheRecord = offTheRecord;

    protocols.forEach((protocol) => protocol?.register?.(session));

    extensions.initializeSession(
      session,
      `${app.getAppPath()}/build/api-preload.bundle.js`,
    );

    // hookBrowserContextEvents(this);
  }

  public async loadExtensions() {
    if (!process.env.ENABLE_EXTENSIONS || this.offTheRecord) return;

    const extensionsPath = getPath('extensions');
    const dirs = await promises.readdir(extensionsPath);

    for (const dir of dirs) {
      try {
        const path = resolve(extensionsPath, dir);
        const extension = await this.session.loadExtension(path);
        await extensions.browserAction.loadFromManifest(
          this.session,
          extension,
        );
      } catch (e) {
        console.error(e);
      }
    }
  }

  public static from(session: Electron.Session, offTheRecord: boolean) {
    if (this.browserContexts.has(session))
      return this.browserContexts.get(session);

    const browserContext = new BrowserContext(session, offTheRecord);
    this.browserContexts.set(session, browserContext);

    return browserContext;
  }
}
