import { observable, computed } from 'mobx';

import { IDownloadItem } from '~/interfaces';
import { NEWTAB_URL } from '~/constants/tabs';
import { IURLSegment } from '~/interfaces/urls';
import { TabGroupsStore } from './tab-groups';
import { AddTabStore } from './add-tab';
import { TabsStore } from './tabs';
import { getTheme } from '~/utils/themes';
import { ExtensionsStore } from './extensions';

// TODO: sandbox
export class Store {
  // public settings = new SettingsStore(this);
  // public history = new HistoryStore();
  // public startupTabs = new StartupTabsStore(this);
  // public autoFill = new AutoFillStore();
  // public bookmarksBar = new BookmarkBarStore(this);

  public addTab = new AddTabStore();
  public tabs = new TabsStore();
  public tabGroups = new TabGroupsStore(this);
  public extensions = new ExtensionsStore();

  // @computed
  // public get theme() {
  //   return getTheme(this.settings.object.theme);
  // }

  @computed
  public get theme() {
    return getTheme('wexond-light');
  }

  public inputRef: HTMLInputElement;

  public canOpenSearch = false;

  @observable
  public addressbarTextVisible = true;

  @observable
  public addressbarFocused = false;

  @observable
  public addressbarEditing = false;

  private addressbarText = '';

  @computed
  public get isCompact() {
    // return this.settings.object.topBarVariant === 'compact';
    return false;
  }

  private getAddressbarValue() {
    const tab = this.tabs.selectedTab;
    if (tab?.addressbarValue != null) return tab.addressbarValue;
    else if (tab && !tab?.url?.startsWith(NEWTAB_URL))
      return tab.url[tab.url.length - 1] === '/'
        ? tab.url.slice(0, -1)
        : tab.url;
    return '';
  }

  @computed
  public get addressbarValue() {
    if (this.addressbarFocused) return this.addressbarText;

    this.addressbarText = this.getAddressbarValue();
    return this.addressbarText;
  }

  @computed
  public get addressbarUrlSegments() {
    let capturedText = '';
    let grayOutCaptured = false;
    let hostnameCaptured = false;
    let protocolCaptured = false;
    const segments: IURLSegment[] = [];

    const url = this.addressbarValue;

    const whitelistedProtocols = ['https', 'http', 'ftp', 'wexond'];

    for (let i = 0; i < url.length; i++) {
      const protocol = whitelistedProtocols.find(
        (x) => `${x}:/` === capturedText,
      );
      if (url[i] === '/' && protocol && !protocolCaptured) {
        segments.push({
          value: `${protocol}://`,
          grayOut: true,
        });

        protocolCaptured = true;
        capturedText = '';
      } else if (
        url[i] === '/' &&
        !hostnameCaptured &&
        (protocolCaptured ||
          !whitelistedProtocols.find((x) => `${x}:` === capturedText))
      ) {
        segments.push({
          value: capturedText,
          grayOut: false,
        });

        hostnameCaptured = true;
        capturedText = url[i];
        grayOutCaptured = true;
      } else {
        capturedText += url[i];
      }

      if (i === url.length - 1) {
        segments.push({
          value: capturedText,
          grayOut: grayOutCaptured,
        });
      }
    }

    return segments;
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
  public zoomFactor = 1;

  @observable
  public dialogsVisibility: { [key: string]: boolean } = {
    menu: false,
    'add-bookmark': false,
    zoom: false,
    'extension-popup': false,
    'downloads-dialog': false,
  };

  @computed
  public get downloadProgress() {
    const downloading = this.downloads.filter((x) => !x.completed);

    if (downloading.length === 0) return 0;

    const { totalBytes } = this.downloads.reduce((prev, cur) => ({
      totalBytes: prev.totalBytes + cur.totalBytes,
    }));

    const { receivedBytes } = this.downloads.reduce((prev, cur) => ({
      receivedBytes: prev.receivedBytes + cur.receivedBytes,
    }));

    return receivedBytes / totalBytes;
  }

  public mouse = {
    x: 0,
    y: 0,
  };

  public windowId = 0;

  // public windowId = getCurrentWindow().id;

  // @observable
  // public isIncognito = ipcRenderer.sendSync(`is-incognito-${this.windowId}`);

  public async init() {
    this.windowId = (await browser.windows.getCurrent()).id;
  }

  public constructor() {
    this.init();
    // ipcRenderer.on('fullscreen', (e, fullscreen: boolean) => {
    //   this.isFullscreen = fullscreen;
    // });
    // ipcRenderer.on('html-fullscreen', (e, fullscreen: boolean) => {
    //   this.isHTMLFullscreen = fullscreen;
    // });
    // ipcRenderer.on('update-available', () => {
    //   this.updateAvailable = true;
    // });
    // ipcRenderer.on('download-started', (e, item) => {
    //   this.downloads.push(item);
    //   this.downloadsButtonVisible = true;
    // });
    // ipcRenderer.on('download-progress', (e, item: IDownloadItem) => {
    //   const i = this.downloads.find((x) => x.id === item.id);
    //   i.receivedBytes = item.receivedBytes;
    // });
    // ipcRenderer.on('is-bookmarked', (e, flag) => {
    //   this.isBookmarked = flag;
    // });
    // ipcRenderer.on(
    //   'download-completed',
    //   (e, id: string, downloadNotification: boolean) => {
    //     const i = this.downloads.find((x) => x.id === id);
    //     i.completed = true;
    //     if (this.downloads.filter((x) => !x.completed).length === 0) {
    //       this.downloads = [];
    //     }
    //     if (downloadNotification) {
    //       this.downloadNotification = true;
    //     }
    //   },
    // );
    // ipcRenderer.on('find', () => {
    //   const tab = this.tabs.selectedTab;
    //   if (tab) {
    //     ipcRenderer.send(`find-show-${this.windowId}`, tab.id);
    //   }
    // });
    // if (process.env.ENABLE_EXTENSIONS) {
    //   ipcRenderer.on(
    //     'set-browserAction-info',
    //     async (e, extensionId, action: BrowserActionChangeType, details) => {
    //       if (
    //         this.extensions.defaultBrowserActions.filter(
    //           (x) => x.extensionId === extensionId,
    //         ).length === 0
    //       ) {
    //         this.extensions.load();
    //       }
    //       const handler = (item: IBrowserAction) => {
    //         if (action === 'setBadgeText') {
    //           item.badgeText = details.text;
    //         } else if (action === 'setPopup') {
    //           item.popup = details.popup;
    //         } else if (action === 'setTitle') {
    //           item.title = details.title;
    //         }
    //       };
    //       if (details.tabId) {
    //         this.extensions.browserActions
    //           .filter(
    //             (x) =>
    //               x.extensionId === extensionId && x.tabId === details.tabId,
    //           )
    //           .forEach(handler);
    //       } else {
    //         this.extensions.defaultBrowserActions
    //           .filter((x) => x.extensionId === extensionId)
    //           .forEach(handler);
    //         this.extensions.browserActions
    //           .filter((x) => x.extensionId === extensionId)
    //           .forEach(handler);
    //       }
    //     },
    //   );
    //   ipcRenderer.send('load-extensions');
    // }
    // ipcRenderer.send('update-check');

    browser.overlayPrivate.onPopupToggled.addListener((name, visible) => {
      this.dialogsVisibility[name] = visible;
    });

    browser.ipcRenderer.on(`addressbar-update-input`, (e, data) => {
      const tab = this.tabs.getTabById(data.id);
      this.addressbarEditing = false;

      if (tab) {
        tab.addressbarValue = data.text;
        tab.addressbarSelectionRange = [data.selectionStart, data.selectionEnd];

        if (tab.isSelected) {
          this.inputRef.value = data.text;
          this.inputRef.setSelectionRange(
            data.selectionStart,
            data.selectionEnd,
          );
          if (data.focus) {
            this.inputRef.focus();
          }
          if (data.escape) {
            this.addressbarFocused = true;
            this.tabs.selectedTab.addressbarValue = null;
            requestAnimationFrame(() => {
              this.inputRef.select();
            });
          }
        }
      }
    });
  }
}

export default new Store();
