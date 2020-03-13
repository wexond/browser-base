import { observable, computed, toJS } from 'mobx';

import { TabsStore } from './tabs';
import { TabGroupsStore } from './tab-groups';
import { AddTabStore } from './add-tab';
import { ipcRenderer } from 'electron';
import { ExtensionsStore } from './extensions';
import { SettingsStore } from './settings';
import { getCurrentWindow } from '../utils/windows';
import { StartupTabsStore } from './startup-tabs';
import { getTheme } from '~/utils/themes';
import { HistoryStore } from './history';
import { AutoFillStore } from './autofill';
import { IDownloadItem, BrowserActionChangeType } from '~/interfaces';
import { IBrowserAction } from '../models';

export class Store {
  public settings = new SettingsStore(this);
  public history = new HistoryStore();
  public addTab = new AddTabStore();
  public tabs = new TabsStore();
  public extensions = new ExtensionsStore();
  public startupTabs = new StartupTabsStore(this);
  public tabGroups = new TabGroupsStore(this);
  public autoFill = new AutoFillStore();

  @computed
  public get theme() {
    return getTheme(this.settings.object.theme);
  }

  @observable
  public isAlwaysOnTop = false;

  @observable
  public isFullscreen = false;

  @observable
  public isHTMLFullscreen = false;

  @observable
  public updateAvailable = false;

  @observable
  public navigationState = {
    canGoBack: false,
    canGoForward: false,
  };

  @observable
  public downloadsButtonVisible = false;

  @observable
  public downloadNotification = false;

  @observable
  public downloads: IDownloadItem[] = [];

  @observable
  public isBookmarked = false;

  @observable
  public dialogsVisibility: { [key: string]: boolean } = {
    menu: false,
    'add-bookmark': false,
    'extension-popup': false,
    'downloads-dialog': false,
  };

  @computed
  public get downloadProgress() {
    const downloading = this.downloads.filter(x => !x.completed);

    if (downloading.length === 0) return 0;

    const { totalBytes } = this.downloads.reduce((prev, cur) => ({
      totalBytes: prev.totalBytes + cur.totalBytes,
    }));

    const { receivedBytes } = this.downloads.reduce((prev, cur) => ({
      receivedBytes: prev.receivedBytes + cur.receivedBytes,
    }));

    return receivedBytes / totalBytes;
  }

  public canToggleMenu = false;

  public mouse = {
    x: 0,
    y: 0,
  };

  public windowId = getCurrentWindow().id;

  @observable
  public isIncognito = ipcRenderer.sendSync(`is-incognito-${this.windowId}`);

  public constructor() {
    ipcRenderer.on('update-navigation-state', (e, data) => {
      this.navigationState = data;
    });

    ipcRenderer.on('fullscreen', (e, fullscreen: boolean) => {
      this.isFullscreen = fullscreen;
    });

    ipcRenderer.on('html-fullscreen', (e, fullscreen: boolean) => {
      this.isHTMLFullscreen = fullscreen;
    });

    ipcRenderer.on('update-available', () => {
      this.updateAvailable = true;
    });

    ipcRenderer.on('download-started', (e, item) => {
      this.downloads.push(item);
      this.downloadsButtonVisible = true;
    });

    ipcRenderer.on('download-progress', (e, item: IDownloadItem) => {
      const i = this.downloads.find(x => x.id === item.id);
      i.receivedBytes = item.receivedBytes;
    });

    ipcRenderer.on('is-bookmarked', (e, flag) => {
      this.isBookmarked = flag;
    });

    ipcRenderer.on(
      'download-completed',
      (e, id: string, downloadNotification: boolean) => {
        const i = this.downloads.find(x => x.id === id);
        i.completed = true;

        if (this.downloads.filter(x => !x.completed).length === 0) {
          this.downloads = [];
        }

        if (downloadNotification) {
          this.downloadNotification = true;
        }
      },
    );

    ipcRenderer.on(
      'set-browserAction-info',
      async (e, extensionId, action: BrowserActionChangeType, details) => {
        if (
          this.extensions.defaultBrowserActions.filter(
            x => x.extensionId === extensionId,
          ).length === 0
        ) {
          this.extensions.load();
        }

        const handler = (item: IBrowserAction) => {
          if (action === 'setBadgeText') {
            item.badgeText = details.text;
          } else if (action === 'setPopup') {
            item.popup = details.popup;
          } else if (action === 'setTitle') {
            item.title = details.title;
          }
        };

        if (details.tabId) {
          this.extensions.browserActions
            .filter(
              x => x.extensionId === extensionId && x.tabId === details.tabId,
            )
            .forEach(handler);
        } else {
          this.extensions.defaultBrowserActions
            .filter(x => x.extensionId === extensionId)
            .forEach(handler);
          this.extensions.browserActions
            .filter(x => x.extensionId === extensionId)
            .forEach(handler);
        }
      },
    );

    ipcRenderer.on('find', () => {
      const tab = this.tabs.selectedTab;
      if (tab) {
        ipcRenderer.send(
          `find-show-${this.windowId}`,
          tab.id,
          toJS(tab.findInfo, { recurseEverything: true }),
        );
      }
    });

    ipcRenderer.on('dialog-visibility-change', (e, name, state) => {
      this.dialogsVisibility[name] = state;
    });

    ipcRenderer.send('update-check');
    ipcRenderer.send('load-extensions');
  }
}

export default new Store();
