import { BrowserView, app } from 'electron';
import { appWindow } from '.';

export default class BrowserViewWrapper extends BrowserView {
  public title: string = '';
  public url: string = '';
  public tabId: number;

  constructor(id: number) {
    super({
      webPreferences: {
        preload: `${app.getAppPath()}/src/main/preload.js`,
        nodeIntegration: false,
      },
    });

    this.tabId = id;

    this.webContents.addListener('did-stop-loading', () => {
      this.updateNavigationState();
    });

    this.webContents.addListener('did-start-navigation', () => {
      this.updateNavigationState();
    });

    this.webContents.addListener(
      'page-favicon-updated',
      async (e, favicons) => {
        appWindow.window.webContents.send(
          `browserview-favicon-updated-${this.tabId}`,
          favicons[0],
        );
      },
    );

    this.webContents.addListener('did-change-theme-color', (e, color) => {
      appWindow.window.webContents.send(
        `browserview-theme-color-updated-${this.tabId}`,
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

    this.setAutoResize({ width: true, height: true });
    this.webContents.loadURL('about:blank');
  }

  public updateNavigationState() {
    if (this.isDestroyed()) return;

    if (appWindow.browserViewManager.selectedId === this.tabId) {
      appWindow.window.webContents.send('update-navigation-state', {
        canGoBack: this.webContents.canGoBack(),
        canGoForward: this.webContents.canGoForward(),
      });
    }
  }
}
