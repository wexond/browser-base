import { Tab } from './tab';
import { extensions } from './extensions';
import { BrowserWindow } from 'electron';
import { Application } from './application';

export class Tabs {
  public tabs: Map<number, Tab> = new Map();

  constructor() {
    extensions.tabs.onCreate = async (session, details) => {
      const tab = new Tab(session, details.windowId);
      this.tabs.set(tab.id, tab);

      return tab.id;
    };

    extensions.tabs.on('activated', (tabId, windowId) => {
      const window = Application.instance.windows.fromId(windowId);
      if (!window) return;

      const tab = this.tabs.get(tabId);

      const prevTab = this.tabs.get(window.selectedTabId);

      if (prevTab) {
        window.win.removeBrowserView(prevTab.browserView);
      }

      window.selectedTabId = tabId;

      window.win.addBrowserView(tab.browserView);

      // if (focus) {
      if (true) {
        // Also fixes switching tabs with Ctrl + Tab
        tab.webContents.focus();
      } else {
        window.webContents.focus();
      }

      // window.updateTitle();
      // view.updateBookmark();

      this.fixBounds(windowId);

      // view.updateNavigationState();

      // this.emit('activated', id);
    });

    extensions.tabs.on('updated', (tabId, changeInfo, details) => {
      console.log(details.url);
      Application.instance.storage.favicons.saveFavicon(
        details.url,
        details.favIconUrl,
      );

      if (changeInfo.url) {
        Application.instance.storage.history.addUrl({
          url: details.url,
          title: details.title,
        });
      }

      if (changeInfo.title) {
        Application.instance.storage.history.setTitleForUrl(
          details.url,
          changeInfo.title,
        );
      }
    });

    extensions.tabs.on('will-remove', (tabId) => {
      this.destroy(tabId);
    });
  }

  public destroy(id: number) {
    const tab = this.tabs.get(id);
    if (!tab) return;

    this.tabs.delete(id);

    if (!tab.browserView.isDestroyed()) {
      const window = BrowserWindow.fromId(tab.windowId);
      window.removeBrowserView(tab.browserView);
      tab.destroy();
    }
  }

  public async fixBounds(windowId: number) {
    const window = Application.instance.windows.fromId(windowId);
    if (!window) return;

    const tab = this.tabs.get(window.selectedTabId);

    if (!tab) return;

    const { width, height } = window.win.getContentBounds();

    const toolbarContentHeight = await window.webContents.executeJavaScript(`
      document.getElementById('app').offsetHeight
    `);

    const fullscreen = false;

    const newBounds = {
      x: 0,
      y: fullscreen ? 0 : toolbarContentHeight,
      width,
      height: fullscreen ? height : height - toolbarContentHeight,
    };

    if (newBounds !== tab.bounds) {
      tab.browserView.setBounds(newBounds);
      tab.bounds = newBounds;
    }
  }
}
