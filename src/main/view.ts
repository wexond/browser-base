import { BrowserView, app } from 'electron';
import { engine } from './services/adblock';
import { parse } from 'tldts-experimental';
import { getViewMenu } from './menus/view';
import { AppWindow } from './windows';
import { windowsManager } from '.';

export class View extends BrowserView {
  public title: string = '';
  public url: string = '';
  public homeUrl: string;

  constructor(public window: AppWindow, url: string) {
    super({
      webPreferences: {
        preload: `${app.getAppPath()}/build/view-preload.js`,
        nodeIntegration: false,
        contextIsolation: true,
        partition: 'persist:view',
        plugins: true,
        additionalArguments: [`--window-id=${window.id}`],
        nativeWindowOpen: true,
      },
    });

    this.homeUrl = url;

    this.webContents.on('context-menu', (e, params) => {
      const menu = getViewMenu(this.window, params, this.webContents);
      menu.popup();
    });

    this.webContents.addListener('found-in-page', (e, result) => {
      this.window.findWindow.webContents.send('found-in-page', result);
    });

    this.webContents.addListener('page-title-updated', (e, title) => {
      this.window.webContents.send(
        `view-title-updated-${this.webContents.id}`,
        title,
      );
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

    this.webContents.addListener('did-start-navigation', (...args: any[]) => {
      this.updateNavigationState();

      const url = this.webContents.getURL();

      // Adblocker cosmetic filtering
      if (engine && windowsManager.settings.object.shield) {
        if (url === '') return;

        const { styles, scripts } = engine.getCosmeticsFilters({
          url,
          ...parse(url),
        });

        this.webContents.insertCSS(styles);

        for (const script of scripts) {
          this.webContents.executeJavaScript(script);
        }
      }

      this.window.webContents.send(
        `load-commit-${this.webContents.id}`,
        ...args,
      );
    });

    this.webContents.addListener(
      'new-window',
      (
        e,
        url,
        frameName,
        disposition,
        options,
        additionalFeatures,
        referrer,
      ) => {
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
      'page-favicon-updated',
      async (e, favicons) => {
        this.window.webContents.send(
          `browserview-favicon-updated-${this.webContents.id}`,
          favicons[0],
        );
      },
    );

    this.webContents.addListener('did-change-theme-color', (e, color) => {
      this.window.webContents.send(
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
      horizontal: true,
      vertical: true,
    });
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

  public async getScreenshot(): Promise<string> {
    return new Promise(resolve => {
      this.webContents.capturePage(img => {
        resolve(img.toDataURL());
      });
    });
  }
}