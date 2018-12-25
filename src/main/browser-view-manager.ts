import { BrowserView, ipcMain } from 'electron';
import { TOOLBAR_HEIGHT } from '~/renderer/app/constants/design';
import { appWindow } from '.';

export class BrowserViewManager {
  constructor() {
    ipcMain.on(
      'browserview-create',
      (e: Electron.IpcMessageEvent, tabId: number) => {
        const view = this.create();
        appWindow.window.webContents.send(
          `new-browserview-id-${tabId}`,
          view.id,
        );
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

  public create() {
    const view = new BrowserView();
    view.setAutoResize({ width: true, height: true });
    view.webContents.loadURL('https://google.com');

    return view;
  }

  public select(id: number) {
    const view = BrowserView.fromId(id);
    appWindow.window.setBrowserView(view);

    const { width, height } = appWindow.window.getBounds();
    view.setBounds({
      x: 0,
      y: TOOLBAR_HEIGHT + 1,
      width,
      height,
    });
  }

  public remove(id: number) {
    const view = BrowserView.fromId(id);
    view.destroy();
  }
}
