import { remote } from 'electron';
import { observer } from 'mobx-react';
import { resolve } from 'path';
import React from 'react';

import { Page, Tab } from '@/models/app';
import store from '@app/store';
import { PageMenuMode } from '@/enums/app';
import { databases } from '@/constants/app';
import { getContextMenuPos } from '@/utils/app/context-menu';
import { isWexondURL } from '@/utils/url';
import StyledPage from './styles';

@observer
export default class extends React.Component<{ page: Page }> {
  private lastURL = '';
  private lastHistoryItemID: string;
  private webview: Electron.WebviewTag;
  private tab: Tab;
  private listeners: { name: string; callback: any }[] = [];
  private processId: number;

  public componentDidMount() {
    const { page } = this.props;
    const { id } = page;
    const tab = store.tabsStore.getTabById(id);

    this.tab = tab;

    this.addWebviewListener('did-stop-loading', this.onDidStopLoading);
    this.addWebviewListener('did-start-loading', this.onDidStartLoading);
    this.addWebviewListener('page-title-updated', this.onPageTitleUpdated);
    this.addWebviewListener('load-commit', this.onLoadCommit);
    this.addWebviewListener('page-favicon-updated', this.onPageFaviconUpdated);
    this.addWebviewListener('dom-ready', this.onDomReady);
    this.addWebviewListener('enter-html-full-screen', this.onFullscreenEnter);
    this.addWebviewListener('leave-html-full-screen', this.onFullscreenLeave);
    this.addWebviewListener('new-window', this.onNewWindow);
    this.addWebviewListener('did-finish-load', this.onDidFinishLoad);
    this.addWebviewListener('ipc-message', this.onIpcMessage);
    this.webview.addEventListener('dom-ready', this.onceDomReady);

    page.webContentsId = this.webview.getWebContents().id;

    this.processId = this.webview.getWebContents().getOSProcessId();
  }

  public componentWillUnmount() {
    for (const listener of this.listeners) {
      this.webview.removeEventListener(listener.name, listener.callback);
    }

    this.listeners = [];

    store.isFullscreen = false;
  }

  public onceDomReady = () => {
    this.webview.getWebContents().on('context-menu', this.onContextMenu);
    this.webview.removeEventListener('dom-ready', this.onceDomReady);
  };

  public updateURL = (url: string) => {
    if (this.tab.url !== url) {
      this.tab.url = url;
      this.updateData();
      this.tab.isBookmarked = !!store.bookmarksStore.bookmarks.find(
        x => x.url === url,
      );
      this.emitEvent(
        'tabs',
        'onUpdated',
        this.tab.id,
        {
          url,
        },
        this.tab.getApiTab(),
      );
    }
  };

  public addWebviewListener(name: string, callback: any) {
    this.webview.addEventListener(name, callback);
    this.listeners.push({ name, callback });
  }

  public emitEvent = (scope: string, name: string, ...data: any[]) => {
    this.webview
      .getWebContents()
      .send(`api-emit-event-${scope}-${name}`, ...data);

    const backgroundPages = remote.getGlobal('backgroundPages');

    Object.keys(backgroundPages).forEach(key => {
      const webContents = remote.webContents.fromId(
        backgroundPages[key].webContentsId,
      );
      webContents.send(`api-emit-event-${scope}-${name}`, ...data);
    });
  };

  public onIpcMessage = (e: Electron.IpcMessageEvent, args: any[]) => {
    if (e.channel === 'api-tabs-getCurrent') {
      this.webview
        .getWebContents()
        .send('api-tabs-getCurrent', this.tab.getApiTab());
    } else if (e.channel === 'history-delete') {
      for (const id of e.args) {
        store.historyStore.removeItem(id);
      }
    } else if (e.channel === 'bookmarks-delete') {
      for (const id of e.args) {
        store.bookmarksStore.removeItem(id);
      }
    } else if (e.channel === 'bookmarks-edit') {
      store.bookmarksStore.editItem(e.args[0], e.args[1], e.args[2]);
    } else if (e.channel === 'bookmarks-add-folder') {
      store.bookmarksStore.addFolder(e.args[0], e.args[1]);
    }
  };

  public onDidStartLoading = () => {
    this.emitEvent('webNavigation', 'onBeforeNavigate', {
      tabId: this.tab.id,
      url: this.tab.url,
      frameId: 0,
      timeStamp: Date.now(),
      processId: -1,
      parentFrameId: -1,
    });

    this.emitEvent(
      'tabs',
      'onUpdated',
      this.tab.id,
      {
        status: 'loading',
      },
      this.tab.getApiTab(),
    );
  };

  public onDidFinishLoad = (e: Electron.DidNavigateEvent) => {
    this.emitEvent('webNavigation', 'onCompleted', {
      tabId: this.tab.id,
      url: this.tab.url,
      frameId: 0,
      timeStamp: Date.now(),
      processId: this.processId,
    });

    const { page } = this.props;

    page.wexondPage = isWexondURL(this.tab.url);

    if (page.wexondPage) {
      this.webview.send('dictionary', store.dictionary);
      this.webview.send('favicons', store.faviconsStore.favicons);

      if (page.wexondPage === 'history') {
        this.webview.send('history', store.historyStore.historyItems);
      } else if (page.wexondPage === 'bookmarks') {
        this.webview.send('bookmarks-add', store.bookmarksStore.bookmarks);
      }
    }
  };

  public onDomReady = () => {
    this.emitEvent('webNavigation', 'onDOMContentLoaded', {
      tabId: this.tab.id,
      url: this.webview.getURL(),
      frameId: 0,
      timeStamp: Date.now(),
      processId: this.processId,
    });
    this.webview.getWebContents().setUserAgent(remote.getGlobal('userAgent'));
  };

  public onNewWindow = (e: Electron.NewWindowEvent) => {
    let tab: Tab;

    if (e.disposition === 'new-window' || e.disposition === 'foreground-tab') {
      tab = store.tabsStore.addTab({ url: e.url, active: true });
    } else if (e.disposition === 'background-tab') {
      tab = store.tabsStore.addTab({ url: e.url, active: false });
    }

    this.emitEvent('webNavigation', 'onCreatedNavigationTarget', {
      sourceTabId: this.tab.id,
      sourceProcessId: this.processId,
      sourceFrameId: 0,
      timeStamp: Date.now(),
      url: e.url,
      tabId: tab,
    });
  };

  public onContextMenu = (
    e: Electron.Event,
    params: Electron.ContextMenuParams,
  ) => {
    store.pageMenuStore.visible = true;
    store.pageMenuStore.params = params;

    if (params.linkURL && params.hasImageContents) {
      store.pageMenuStore.mode = PageMenuMode.ImageAndURL;
    } else if (params.linkURL) {
      store.pageMenuStore.mode = PageMenuMode.URL;
    } else if (params.hasImageContents) {
      store.pageMenuStore.mode = PageMenuMode.Image;
    } else {
      store.pageMenuStore.mode = PageMenuMode.Normal;
    }

    // Get position
    const pos = getContextMenuPos(store.pageMenuStore.ref);

    // Set the new position.
    store.pageMenuStore.x = pos.x;
    store.pageMenuStore.y = pos.y;
  };

  public onDidStopLoading = () => {
    const url = this.webview.getURL();

    store.navigationStateStore.refresh();

    this.updateURL(url);
    this.tab.loading = false;
    this.tab.isBookmarked = store.bookmarksStore.isBookmarked(url);

    this.emitEvent(
      'tabs',
      'onUpdated',
      this.tab.id,
      {
        status: 'complete',
      },
      this.tab.getApiTab(),
    );
  };

  public onLoadCommit = async ({
    url,
    isMainFrame,
  }: Electron.LoadCommitEvent) => {
    this.tab.loading = true;

    this.emitEvent('webNavigation', 'onCommitted', {
      tabId: this.tab.id,
      url: this.webview.getURL(),
      frameId: 0,
      timeStamp: Date.now(),
      processId: this.processId,
    });

    if (isMainFrame) {
      if (url !== this.lastURL && !url.startsWith('wexond://')) {
        this.lastHistoryItemID = await store.historyStore.addItem({
          title: this.tab.title,
          url,
          favicon: this.tab.favicon,
          date: new Date().toString(),
        });

        this.lastURL = url;
      }
      this.updateURL(url);
    }
  };

  public onPageFaviconUpdated = ({
    favicons,
  }: Electron.PageFaviconUpdatedEvent) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = async () => {
      if (request.readyState === 4) {
        if (request.status === 404) {
          this.tab.favicon = '';
        } else {
          this.tab.favicon = favicons[0];
          store.faviconsStore.addFavicon(favicons[0]);
        }
      }
      this.updateData();
    };

    this.emitEvent(
      'tabs',
      'onUpdated',
      this.tab.id,
      {
        favIconUrl: favicons[0],
      },
      this.tab.getApiTab(),
    );

    request.open('GET', favicons[0], true);
    request.send(null);
  };

  public updateData = () => {
    if (this.lastURL === this.tab.url && this.lastHistoryItemID) {
      const url = this.webview.getURL();
      const { title, favicon } = this.tab;

      const item = store.historyStore.getById(this.lastHistoryItemID);
      if (item) {
        item.title = title;
        item.url = url;
        item.favicon = favicon;
      }

      databases.history.update(
        {
          _id: this.lastHistoryItemID,
        },
        {
          $set: {
            title,
            url,
            favicon,
          },
        },
      );
    }
  };

  public onPageTitleUpdated = ({ title }: Electron.PageTitleUpdatedEvent) => {
    this.tab.title = title;

    this.updateData();

    this.emitEvent(
      'tabs',
      'onUpdated',
      this.tab.id,
      {
        title,
      },
      this.tab.getApiTab(),
    );
  };

  public onFullscreenEnter = () => {
    store.isHTMLFullscreen = true;
  };

  public onFullscreenLeave = () => {
    store.isHTMLFullscreen = false;
  };

  public render() {
    const { page } = this.props;
    const { url, id } = page;

    return (
      <StyledPage selected={page.isSelected}>
        <webview
          src={url}
          style={{
            height: '100%',
          }}
          ref={(r: Electron.WebviewTag) => {
            page.webview = r;
            this.webview = r;
          }}
          partition="persist:webviewsession"
          preload={`file://${resolve(
            remote.app.getAppPath(),
            'build/webview-preload.js?test=test',
          )}`}
          allowFullScreen
        />
      </StyledPage>
    );
  }
}
