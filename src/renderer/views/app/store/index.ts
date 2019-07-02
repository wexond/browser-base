import { observable, computed } from 'mobx';

import { TabsStore } from './tabs';
import { TabGroupsStore } from './tab-groups';
import { AddTabStore } from './add-tab';
import { ipcRenderer, IpcMessageEvent, remote } from 'electron';
import { OverlayStore } from './overlay';
import { HistoryStore } from './history';
import { FaviconsStore } from './favicons';
import { SuggestionsStore } from './suggestions';
import { ExtensionsStore } from './extensions';
import { extname } from 'path';
import { BookmarksStore } from './bookmarks';
import { DownloadsStore } from './downloads';
import { lightTheme } from '~/renderer/constants/themes';
import { WeatherStore } from './weather';
import { SettingsStore } from './settings';

export class Store {
  public history = new HistoryStore();
  public bookmarks = new BookmarksStore();
  public settings = new SettingsStore(this);
  public suggestions = new SuggestionsStore();
  public favicons = new FaviconsStore();
  public addTab = new AddTabStore();
  public tabGroups = new TabGroupsStore();
  public tabs = new TabsStore();
  public overlay = new OverlayStore();
  public extensions = new ExtensionsStore();
  public downloads = new DownloadsStore();
  public weather = new WeatherStore();

  @observable
  public theme = lightTheme;

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

  @computed
  public get tabbarVisible() {
    return (
      this.tabGroups.currentGroup.tabs.length > 0 &&
      this.overlay.currentContent === 'default'
    );
  }

  @computed
  public get searchEngine() {
    return this.settings.object.searchEngines[
      this.settings.object.searchEngine
    ];
  }

  public canToggleMenu = false;

  public mouse = {
    x: 0,
    y: 0,
  };

  constructor() {
    ipcRenderer.on(
      'update-navigation-state',
      (e: IpcMessageEvent, data: any) => {
        this.navigationState = data;
      },
    );

    ipcRenderer.on('fullscreen', (e: any, fullscreen: boolean) => {
      this.isFullscreen = fullscreen;
    });

    ipcRenderer.on('html-fullscreen', (e: any, fullscreen: boolean) => {
      this.isHTMLFullscreen = fullscreen;
    });

    ipcRenderer.on(
      'update-available',
      (e: IpcMessageEvent, version: string) => {
        this.updateInfo.version = version;
        this.updateInfo.available = true;
      },
    );

    ipcRenderer.on(
      'api-tabs-query',
      (e: IpcMessageEvent, webContentsId: number) => {
        const sender = remote.webContents.fromId(webContentsId);

        sender.send(
          'api-tabs-query',
          this.tabs.list.map(tab => tab.getApiTab()),
        );
      },
    );

    ipcRenderer.on(
      'api-browserAction-setBadgeText',
      (
        e: IpcMessageEvent,
        senderId: number,
        extensionId: string,
        details: chrome.browserAction.BadgeTextDetails,
      ) => {
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
        const contents = remote.webContents.fromId(senderId);
        contents.send('api-browserAction-setBadgeText');
      },
    );

    ipcRenderer.on('find', () => {
      const tab = this.tabs.selectedTab;
      if (tab) {
        ipcRenderer.send('find-show', tab.id, tab.findInfo);
      }
    });

    ipcRenderer.send('update-check');

    requestAnimationFrame(() => {
      if (remote.process.argv.length > 1 && remote.process.env.ENV !== 'dev') {
        const path = remote.process.argv[1];
        const ext = extname(path);

        if (ext === '.html') {
          this.tabs.addTab({ url: `file:///${path}`, active: true });
        }
      }
    });

    this.settings.load();
  }
}

export default new Store();
