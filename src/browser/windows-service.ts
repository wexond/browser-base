import { AppWindow } from './windows/app';
import { BrowserWindow, ipcMain } from 'electron';
import { BrowserContext } from './browser-context';
import { extensions, Extensions } from './extensions';
import { Application } from './application';
import { showExtensionDialog } from './dialogs/extension-popup';
import { HandlerFactory, ISenderDetails } from './extensions/handler-factory';
import { EventHandler } from './extensions/event-handler';

export class WindowsService {
  public list: AppWindow[] = [];

  public current: AppWindow;

  constructor() {
    extensions.windows.on('will-remove', (windowId) => {
      BrowserWindow.fromId(windowId).close();
    });

    extensions.windows.onCreate = async (session, createDetails) => {
      return this.create(BrowserContext.from(session, false), createDetails);
    };

    extensions.browserAction.on('updated', (session, action) => {
      this.getAllInSession(session).forEach((window) => {
        if (action.tabId && window.selectedTabId !== action.tabId) return;
        extensions.browserActionPrivate.sendEventToAll('onUpdated', action);
      });
    });

    const browserActionHandler = HandlerFactory.create(
      'browserActionPrivate',
      this,
    );

    browserActionHandler(
      'openPopup',
      ({ session, sender }: ISenderDetails, { extensionId, details }: any) => {
        const { left, top, inspect } = details;

        const action = extensions.browserActionPrivate.getForTab(
          session,
          extensionId,
          this.fromWebContents(sender).selectedTabId,
        );

        if (!action) return;

        Application.instance.windows
          .fromWebContents(sender)
          .overlayWindow.win.focus();

        extensions.browserActionPrivate.sendEventToAll(
          'onVisibilityChange',
          action,
          true,
        );

        extensions.overlayPrivate.setVisibility(
          {},
          { name: 'extensionPopup', visibility: true },
        );
      },
    );

    // TODO: sandbox
    // ipcMain.handle('get-tab-zoom', (e, tabId) => {
    //   return this.findByBrowserView(tabId).viewManager.views.get(tabId)
    //     .webContents.zoomFactor;
    // });
  }

  public create(
    browserContext: BrowserContext,
    createData: chrome.windows.CreateData,
  ) {
    const appWindow = new AppWindow(browserContext);
    this.list.push(appWindow);

    extensions.windows.observe(appWindow.win, browserContext.session);

    return appWindow.id;
  }

  public getAllInSession(session: Electron.Session) {
    return this.list.filter(
      (x) =>
        x.webContents.session === session ||
        x.browserContext.session === session,
    );
  }

  public fromBrowserWindow(browserWindow: BrowserWindow) {
    return this.list.find((x) => x.id === browserWindow.id);
  }

  public fromWebContents(webContents: Electron.WebContents): AppWindow {
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
