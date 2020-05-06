import { AppWindow } from './windows/app';
import { BrowserWindow, ipcMain } from 'electron';
import { BrowserContext } from './browser-context';
import { extensions } from './extensions';

export class WindowsService {
  public list: AppWindow[] = [];

  public current: AppWindow;

  public lastFocused: AppWindow;

  constructor() {
    extensions.windows.on('will-remove', (windowId) => {
      BrowserWindow.fromId(windowId).close();
    });

    // TODO: sandbox
    // ipcMain.handle('get-tab-zoom', (e, tabId) => {
    //   return this.findByBrowserView(tabId).viewManager.views.get(tabId)
    //     .webContents.zoomFactor;
    // });
  }

  public create(browserContext: BrowserContext) {
    const window = new AppWindow(browserContext);
    this.list.push(window);

    extensions.windows.observe(window.win);

    window.win.on('focus', () => {
      this.lastFocused = window;
    });

    return window;
  }

  public findByBrowserView(webContentsId: number) {
    return this.list.find((x) => !!x.viewManager.views.get(webContentsId));
  }

  public fromBrowserWindow(browserWindow: BrowserWindow) {
    return this.list.find((x) => x.id === browserWindow.id);
  }

  public broadcast(channel: string, ...args: unknown[]) {
    this.list.forEach((appWindow) =>
      appWindow.win.webContents.send(channel, ...args),
    );
  }
}
