import { BrowserView, app } from 'electron';
import { appWindow, settings } from '.';
import { engine } from './services/adblock';
import { parse } from 'tldts';
import { getViewMenu } from './menus/view';

export class View extends BrowserView {
  public title: string = '';
  public url: string = '';
  public homeUrl: string;

  constructor(url: string) {
    super({
      webPreferences: {
        preload: `${app.getAppPath()}/build/view-preload.js`,
        nodeIntegration: false,
        contextIsolation: true,
        partition: 'persist:view',
        plugins: true,
      },
    });

    this.homeUrl = url;

    this.webContents.on('context-menu', (e, params) => {
      const menu = getViewMenu(appWindow, params, this.webContents);
      menu.popup();
    });

    this.webContents.addListener('found-in-page', (e, result) => {
      appWindow.webContents.send('found-in-page', result);
    });

    this.webContents.addListener('did-stop-loading', () => {
      this.updateNavigationState();
      appWindow.webContents.send(`view-loading-${this.webContents.id}`, false);
    });

    this.webContents.addListener('did-start-loading', () => {
      this.updateNavigationState();
      appWindow.webContents.send(`view-loading-${this.webContents.id}`, true);
    });

    this.webContents.addListener('did-start-navigation', (...args: any[]) => {
      this.updateNavigationState();

      const url = this.webContents.getURL();

      // Adblocker cosmetic filtering
      if (engine && settings.isShieldToggled) {
        const { styles, scripts } = engine.getCosmeticsFilters({
          url,
          ...parse(url),
        });

        this.webContents.insertCSS(styles);

        for (const script of scripts) {
          this.webContents.executeJavaScript(script);
        }
      }

      appWindow.webContents.send(`load-commit-${this.webContents.id}`, ...args);
    });

    this.webContents.addListener(
      'new-window',
      (e, url, frameName, disposition) => {
        if (disposition === 'new-window') {
          if (frameName === '_self') {
            e.preventDefault();
            appWindow.viewManager.selected.webContents.loadURL(url);
          } else if (frameName === '_blank') {
            e.preventDefault();
            appWindow.viewManager.create(
              {
                url,
                active: true,
              },
              true,
            );
          }
        } else if (disposition === 'foreground-tab') {
          e.preventDefault();
          appWindow.viewManager.create({ url, active: true }, true);
        } else if (disposition === 'background-tab') {
          e.preventDefault();
          appWindow.viewManager.create({ url, active: false }, true);
        }
      },
    );

    this.webContents.addListener(
      'page-favicon-updated',
      async (e, favicons) => {
        appWindow.webContents.send(
          `browserview-favicon-updated-${this.webContents.id}`,
          favicons[0],
        );
      },
    );

    this.webContents.addListener('did-change-theme-color', (e, color) => {
      appWindow.webContents.send(
        `browserview-theme-color-updated-${this.webContents.id}`,
        color,
      );
    });

    (this.webContents as any).addListener(
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
    });
    this.webContents.loadURL(url);
  }

  public updateNavigationState() {
    if (this.isDestroyed()) return;

    if (appWindow.viewManager.selectedId === this.webContents.id) {
      appWindow.webContents.send('update-navigation-state', {
        canGoBack: this.webContents.canGoBack(),
        canGoForward: this.webContents.canGoForward(),
      });
    }
  }

  public async getScreenshot(): Promise<string> {
    return new Promise(resolve => {
      this.webContents.capturePage(img => {
        resolve(img.toDataURL());
      });
    });
  }
}
