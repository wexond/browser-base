import { BrowserView, ipcMain, app } from 'electron';
import { TOOLBAR_HEIGHT } from '~/renderer/app/constants/design';
import { appWindow } from '.';

export class BrowserViewManager {
  public views: { [key: number]: BrowserView } = {};

  constructor() {
    ipcMain.on(
      'browserview-create',
      (e: Electron.IpcMessageEvent, tabId: number) => {
        this.create(tabId);

        appWindow.window.webContents.send(`browserview-created-${tabId}`);
      },
    );

    ipcMain.on(
      'browserview-select',
      (e: Electron.IpcMessageEvent, id: number) => {
        this.select(id);
      },
    );

    ipcMain.on(
      'browserview-remove',
      (e: Electron.IpcMessageEvent, id: number) => {
        this.remove(id);
      },
    );

    ipcMain.on('browserview-clear', () => {
      this.clear();
    });
  }

  public create(tabId: number) {
    const view = new BrowserView();
    view.setAutoResize({ width: true, height: true });
    view.webContents.loadURL('https://google.com');

    this.views[tabId] = view;
  }

  public clear() {
    appWindow.window.setBrowserView(null);
    for (const key in this.views) {
      this.remove(parseInt(key, 10));
    }
  }

  public select(tabId: number) {
    const view = this.views[tabId];

    if (!view || view.isDestroyed()) {
      appWindow.window.setBrowserView(null);
      return;
    }

    appWindow.window.setBrowserView(view);

    const { width, height } = appWindow.window.getContentBounds();
    view.setBounds({
      x: 0,
      y: TOOLBAR_HEIGHT + 1,
      width,
      height: height - TOOLBAR_HEIGHT,
    });
  }

  public remove(tabId: number) {
    const view = this.views[tabId];
    if (!view || view.isDestroyed()) return;
    if (appWindow.window.getBrowserView() === view) {
      appWindow.window.setBrowserView(null);
    }

    view.destroy();
  }
}
