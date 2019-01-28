import { BrowserView } from 'electron';
import { appWindow } from '.';

export default class BrowserViewWrapper extends BrowserView {
  public title: string = '';
  public tabId: number;

  constructor(id: number) {
    super();

    this.tabId = id;

    this.webContents.addListener('did-stop-loading', () => {
      this.updateNavigationState();
    });

    this.webContents.addListener('did-start-loading', () => {
      this.updateNavigationState();
    });

    this.setAutoResize({ width: true, height: true });
    this.webContents.loadURL('https://google.com');
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
