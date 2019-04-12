import { observable } from 'mobx';
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

export class Store {
  public historyStore = new HistoryStore();
  public suggestionsStore = new SuggestionsStore();
  public faviconsStore = new FaviconsStore();
  public addTabStore = new AddTabStore();
  public tabGroupsStore = new TabGroupsStore();
  public tabsStore = new TabsStore();
  public overlayStore = new OverlayStore();
  public extensionsStore = new ExtensionsStore();

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
          this.tabsStore.tabs.map(tab => tab.getApiTab()),
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
          const browserAction = this.extensionsStore.queryBrowserAction({
            extensionId,
            tabId: details.tabId,
          })[0];

          if (browserAction) {
            browserAction.badgeText = details.text;
          }
        } else {
          this.extensionsStore
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

    ipcRenderer.send('update-check');

    requestAnimationFrame(() => {
      if (remote.process.argv.length > 1 && remote.process.env.ENV !== 'dev') {
        const path = remote.process.argv[1];
        const ext = extname(path);

        if (ext === '.html') {
          this.tabsStore.addTab({ url: `file:///${path}`, active: true });
        }
      }
    });
  }
}

export default new Store();
