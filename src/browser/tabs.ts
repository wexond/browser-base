import { Tab } from './tab';
import { extensions } from './extensions';
import { BrowserWindow } from 'electron';

interface IWindowDetails {
  selectedTabId: number;
}

export class Tabs {
  public tabs: Map<number, Tab> = new Map();
  public windowsDetails: Map<number, IWindowDetails> = new Map();

  constructor() {
    extensions.tabs.onCreate = async (session, details) => {
      const tab = new Tab(session, details.url);
      this.tabs.set(tab.id, tab);

      if (!this.windowsDetails.has(details.windowId)) {
        this.windowsDetails.set(details.windowId, {
          selectedTabId: -1,
        });
      }

      return tab.id;
    };

    extensions.tabs.on('activated', (tabId, windowId) => {
      const windowDetails = this.windowsDetails.get(windowId);
      if (!windowDetails) return;

      const tab = this.tabs.get(tabId);
      const window = BrowserWindow.fromId(windowId);

      const prevTab = this.tabs.get(windowDetails.selectedTabId);

      if (prevTab) {
        window.removeBrowserView(prevTab.browserView);
      }

      windowDetails.selectedTabId = tabId;

      window.addBrowserView(tab.browserView);

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

    extensions.tabs.on('will-remove', (tabId, windowId) => {
      this.destroy(tabId, windowId);
    });
  }

  public destroy(id: number, windowId: number) {
    const tab = this.tabs.get(id);
    if (!tab) return;

    this.tabs.delete(id);

    if (!tab.browserView.isDestroyed()) {
      const window = BrowserWindow.fromId(windowId);
      window.removeBrowserView(tab.browserView);
      tab.destroy();
    }
  }

  public async fixBounds(windowId: number) {
    const windowDetails = this.windowsDetails.get(windowId);
    if (!windowDetails) return;

    const window = BrowserWindow.fromId(windowId);
    const tab = this.tabs.get(windowDetails.selectedTabId);

    if (!tab) return;

    const { width, height } = window.getContentBounds();

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
