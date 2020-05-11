import { AppWindow } from './windows/app';
import { BrowserWindow, ipcMain } from 'electron';
import { BrowserContext } from './browser-context';
import { extensions } from './extensions';
import { Application } from './application';
import { showExtensionDialog } from './dialogs/extension-popup';

export class WindowsService {
  public list: AppWindow[] = [];

  public current: AppWindow;

  constructor() {
    extensions.windows.on('will-remove', (windowId) => {
      BrowserWindow.fromId(windowId).close();
    });

    extensions.windows.onCreate = async (session, window) => {
      const appWindow = new AppWindow(
        Application.instance.browserContexts.browserContexts.get(session),
      );
      this.list.push(appWindow);

      return appWindow.id;
    };

    extensions.browserAction.on('updated', (session, action) => {
      this.getAllInSession(session).forEach((window) => {
        if (action.tabId && window.selectedTabId !== action.tabId) return;
        window.send('browserAction.onUpdated', action);
      });
    });

    ipcMain.handle(`browserAction.showPopup`, (e, extensionId, options) => {
      const { left, top, inspect } = options;

      const action = extensions.browserAction.getForTab(
        e.sender.session,
        extensionId,
        this.fromWebContents(e.sender).selectedTabId,
      );

      if (!action) return;

      showExtensionDialog(
        BrowserWindow.fromWebContents(e.sender),
        left,
        top,
        action.popup,
        inspect,
      );
    });

    // TODO: sandbox
    // ipcMain.handle('get-tab-zoom', (e, tabId) => {
    //   return this.findByBrowserView(tabId).viewManager.views.get(tabId)
    //     .webContents.zoomFactor;
    // });
  }

  public getAllInSession(session: Electron.Session) {
    return this.list.filter((x) => x.webContents.session === session);
  }

  public fromBrowserWindow(browserWindow: BrowserWindow) {
    return this.list.find((x) => x.id === browserWindow.id);
  }

  public fromWebContents(webContents: Electron.WebContents) {
    return (
      this.list.find((x) => x.webContents === webContents) ||
      Object.values(Application.instance.tabs.tabs).find(
        (x) => x.webContents === webContents,
      )
    );
  }

  public fromId(id: number) {
    return this.list.find((x) => x.id === id);
  }

  public broadcast(channel: string, ...args: unknown[]) {
    this.list.forEach((appWindow) =>
      appWindow.win.webContents.send(channel, ...args),
    );
  }
}
