import { observable } from 'mobx';

import { TabsStore } from './tabs';
import { TabGroupsStore } from './tab-groups';
import { AddTabStore } from './add-tab';
import { ipcRenderer, remote } from 'electron';
import { ExtensionsStore } from './extensions';
import { extname } from 'path';
import { SettingsStore } from './settings';
import { extensionsRenderer } from 'electron-extensions';
import { getCurrentWindow } from '../utils';
import { StartupTabsStore } from './startup-tabs';
import { getTheme } from '~/utils/themes';
import { HistoryStore } from './history';

export class Store {
  public settings = new SettingsStore(this);
  public history = new HistoryStore();
  public addTab = new AddTabStore();
  public tabGroups = new TabGroupsStore();
  public tabs = new TabsStore();
  public extensions = new ExtensionsStore();
  public startupTabs = new StartupTabsStore(this);

  @observable
  public theme = getTheme('wexond-light');

  @observable
  public isAlwaysOnTop = false;

  @observable
  public isFullscreen = false;

  @observable
  public isHTMLFullscreen = false;

  @observable
  public updateInfo = {
    available: false,
    version: '',
  };

  @observable
  public navigationState = {
    canGoBack: false,
    canGoForward: false,
  };

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

    ipcRenderer.on('update-available', (e, version: string) => {
      this.updateInfo.version = version;
      this.updateInfo.available = true;
    });

    extensionsRenderer.on(
      'set-badge-text',
      (extensionId: string, details: chrome.browserAction.BadgeTextDetails) => {
        if (details.tabId) {
          const browserAction = this.extensions.queryBrowserAction({
            extensionId,
            tabId: details.tabId,
          })[0];

          if (browserAction) {
            browserAction.badgeText = details.text;
          }
        } else {
          this.extensions
            .queryBrowserAction({
              extensionId,
            })
            .forEach(item => {
              item.badgeText = details.text;
            });
        }
      },
    );

    ipcRenderer.on('find', () => {
      const tab = this.tabs.selectedTab;
      if (tab) {
        ipcRenderer.send(`find-show-${this.windowId}`, tab.id, tab.findInfo);
      }
    });

    ipcRenderer.send('update-check');
  }
}

export default new Store();
