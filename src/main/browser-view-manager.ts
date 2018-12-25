import { BrowserView, ipcMain } from 'electron';
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
  }

  public create(tabId: number) {
    const view = new BrowserView();
    view.setAutoResize({ width: true, height: true });
    view.webContents.loadURL('https://google.com');

    this.views[tabId] = view;
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
    appWindow.window.setBrowserView(null);
    view.destroy();
  }
}
