import { BrowserView, app, ipcMain } from 'electron';
import { parse as parseUrl } from 'url';
import { getViewMenu } from './menus/view';
import { AppWindow } from './windows';
import { windowsManager } from '.';
import storage from './services/storage';
import Vibrant from 'node-vibrant';

export class View extends BrowserView {
  public title = '';
  public url = '';
  public homeUrl: string;
  public favicon = '';
  public selected = false;

  public errorURL = '';

  private window: AppWindow;

  public constructor(window: AppWindow, url: string, incognito: boolean) {
    super({
      webPreferences: {
        preload: `${app.getAppPath()}/build/view-preload.bundle.js`,
        nodeIntegration: false,
        contextIsolation: true,
        partition: incognito ? 'view_incognito' : 'persist:view',
        plugins: true,
        additionalArguments: [
          `--window-id=${window.id}`,
          `--blacklist=["wexond://"]`,
        ],
        nativeWindowOpen: true,
        webSecurity: true,
        javascript: true,
      },
    });

    this.webContents.userAgent = this.webContents.userAgent
      .replace(/ Wexond\\?.([^\s]+)/g, '')
      .replace(/ Electron\\?.([^\s]+)/g, '');

    this.window = window;
    this.homeUrl = url;

    ipcMain.handle(`get-error-url-${this.webContents.id}`, async e => {
      return this.errorURL;
    });

    this.webContents.on('context-menu', (e, params) => {
      const menu = getViewMenu(this.window, params, this.webContents);
      menu.popup();
    });

    this.webContents.addListener('found-in-page', (e, result) => {
      this.window.findDialog.webContents.send('found-in-page', result);
    });

    this.webContents.addListener('page-title-updated', (e, title) => {
      this.title = title;

      this.updateWindowTitle();

      this.window.webContents.send(
        `view-title-updated-${this.webContents.id}`,
        title,
      );
    });

    this.webContents.addListener('did-navigate', async (e, url) => {
      this.window.webContents.send(
        `view-did-navigate-${this.webContents.id}`,
        url,
      );

      this.updateURL(url);
    });

    this.webContents.addListener('did-navigate-in-page', (e, url) => {
      this.updateURL(url);
    });

    this.webContents.addListener('did-stop-loading', () => {
      this.updateNavigationState();
      this.window.webContents.send(
        `view-loading-${this.webContents.id}`,
        false,
      );
    });

    this.webContents.addListener('did-start-loading', () => {
      this.updateNavigationState();
      this.window.webContents.send(`view-loading-${this.webContents.id}`, true);
    });

    this.webContents.addListener('did-start-navigation', async (...args) => {
      this.updateNavigationState();

      this.favicon = '';

      this.window.webContents.send(
        `load-commit-${this.webContents.id}`,
        ...args,
      );
    });

    this.webContents.addListener(
      'new-window',
      (e, url, frameName, disposition) => {
        if (disposition === 'new-window') {
          if (frameName === '_self') {
            e.preventDefault();
            this.window.viewManager.selected.webContents.loadURL(url);
          } else if (frameName === '_blank') {
            e.preventDefault();
            this.window.viewManager.create(
              {
                url,
                active: true,
              },
              true,
            );
          }
        } else if (disposition === 'foreground-tab') {
          e.preventDefault();
          this.window.viewManager.create({ url, active: true }, true);
        } else if (disposition === 'background-tab') {
          e.preventDefault();
          this.window.viewManager.create({ url, active: false }, true);
        }
      },
    );

    this.webContents.addListener(
      'did-fail-load',
      (e, errorCode, errorDescription, validatedURL, isMainFrame) => {
        if (isMainFrame) {
          this.errorURL = validatedURL;

          this.webContents.loadURL(`wexond-error://network-error/${errorCode}`);
        }
      },
    );

    this.webContents.addListener(
      'page-favicon-updated',
      async (e, favicons) => {
        this.favicon = favicons[0];

        this.window.webContents.send(
          `update-tab-favicon-${this.webContents.id}`,
          this.favicon,
        );

        try {
          let fav = this.favicon;

          if (fav.startsWith('http')) {
            fav = await windowsManager.addFavicon(fav);
          }
          const buf = Buffer.from(fav.split('base64,')[1], 'base64');

          try {
            const palette = await Vibrant.from(buf).getPalette();

            if (!palette.Vibrant) return;

            this.window.webContents.send(
              `update-tab-color-${this.webContents.id}`,
              palette.Vibrant.getHex(),
            );
          } catch (e) {
            console.error(e);
          }
        } catch (e) {
          this.favicon = '';
          console.error(e);
        }
      },
    );

    this.webContents.addListener('did-change-theme-color', (e, color) => {
      this.window.webContents.send(
        `browserview-theme-color-updated-${this.webContents.id}`,
        color,
      );
    });

    this.webContents.addListener(
      'certificate-error',
      (
        event: Electron.Event,
        url: string,
        error: string,
        certificate: Electron.Certificate,
        callback: Function,
      ) => {
        console.log(certificate, error, url);
        // TODO: properly handle insecure websites.
        event.preventDefault();
        callback(true);
      },
    );

    this.setAutoResize({
      width: true,
      height: true,
    } as any);
    this.webContents.loadURL(url);
  }

  public updateNavigationState() {
    if (this.isDestroyed()) return;

    if (this.window.viewManager.selectedId === this.webContents.id) {
      this.window.webContents.send('update-navigation-state', {
        canGoBack: this.webContents.canGoBack(),
        canGoForward: this.webContents.canGoForward(),
      });
    }
  }

  public async updateCredentials() {
    if (this.isDestroyed()) return;

    const item = await storage.findOne<any>({
      scope: 'formfill',
      query: {
        url: this.hostname,
      },
    });

    this.window.webContents.send(
      `has-credentials-${this.webContents.id}`,
      item != null,
    );
  }

  public updateURL = (url: string) => {
    if (this.url === url) return;

    this.url = url;

    this.window.webContents.send(
      `view-url-updated-${this.webContents.id}`,
      url,
    );

    this.updateCredentials();
  };

  public updateWindowTitle() {
    if (this.selected) this.window.setTitle(`${this.title} - Wexond`);
  }

  public get hostname() {
    return parseUrl(this.url).hostname;
  }
}
