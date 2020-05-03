import { AppWindow } from './windows/app';
import { extensions } from 'electron-extensions';
import { BrowserWindow, ipcMain } from 'electron';

export class WindowsService {
  public list: AppWindow[] = [];

  public current: AppWindow;

  public lastFocused: AppWindow;

  constructor() {
    if (process.env.ENABLE_EXTENSIONS) {
      extensions.tabs.on('activated', (tabId, windowId, focus) => {
        const win = this.list.find((x) => x.id === windowId);
        win.viewManager.select(tabId, focus === undefined ? true : focus);
      });

      extensions.tabs.onCreateDetails = (tab, details) => {
        const win = this.findByBrowserView(tab.id);
        details.windowId = win.id;
      };

      extensions.windows.onCreate = async (details) => {
        return this.open(details.incognito).id;
      };

      extensions.tabs.onCreate = async (details) => {
        const win =
          this.list.find((x) => x.id === details.windowId) || this.lastFocused;

        if (!win) return -1;

        const view = win.viewManager.create(details);
        return view.id;
      };
    }

    ipcMain.handle('get-tab-zoom', (e, tabId) => {
      return this.findByBrowserView(tabId).viewManager.views.get(tabId)
        .webContents.zoomFactor;
    });
  }

  public open(incognito = false) {
    const window = new AppWindow(incognito);
    this.list.push(window);

    if (process.env.ENABLE_EXTENSIONS) {
      extensions.windows.observe(window.win);
    }

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
