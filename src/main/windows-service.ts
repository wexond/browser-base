import { AppWindow } from './windows/app';
import { extensions } from 'electron-extensions';

export class WindowsService {
  public list: AppWindow[] = [];

  public current: AppWindow;

  public lastFocused: AppWindow;

  constructor() {
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

  public open(incognito = false) {
    const window = new AppWindow(incognito);
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
}
