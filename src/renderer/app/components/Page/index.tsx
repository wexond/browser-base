import { remote } from 'electron';
import { observer } from 'mobx-react';
import { resolve } from 'path';
import React from 'react';

import StyledPage from './styles';
import { Page, Tab } from '../../models';
import store from '@app/store';
import { PageMenuMode } from '~/enums';
import { databases } from '~/defaults/databases';
import { HistoryItem } from '~/interfaces';
import { getContextMenuPos } from '~/utils/context-menu';

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
    this.addWebviewListener('did-navigate', this.onDidNavigate);
    this.addWebviewListener('will-navigate', this.onWillNavigate);
    this.addWebviewListener('ipc-message', this.onIpcMessage);
    this.webview.addEventListener('dom-ready', this.onceDomReady);

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

  public onURLChange = (url: string) => {
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
    }
  };

  public onWillNavigate = (e: Electron.WillNavigateEvent) => {
    this.emitEvent('webNavigation', 'onBeforeNavigate', {
      tabId: this.tab.id,
      url: e.url,
      frameId: 0,
      timeStamp: Date.now(),
      processId: -1,
      parentFrameId: -1,
    });
  };

  public onDidStartLoading = () => {
    this.emitEvent('webNavigation', 'onCommitted', {
      tabId: this.tab.id,
      url: this.webview.getURL(),
      frameId: 0,
      timeStamp: Date.now(),
      processId: this.processId,
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

  public onDidNavigate = (e: Electron.DidNavigateEvent) => {
    this.emitEvent('webNavigation', 'onCompleted', {
      tabId: this.tab.id,
      url: e.url,
      frameId: 0,
      timeStamp: Date.now(),
      processId: this.processId,
    });

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

  public onDomReady = () => {
    this.emitEvent('webNavigation', 'onDOMContentLoaded', {
      tabId: this.tab.id,
      url: this.webview.getURL(),
      frameId: 0,
      timeStamp: Date.now(),
      processId: this.processId,
    });
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

    this.onURLChange(url);
    this.tab.loading = false;
    this.tab.isBookmarked = store.bookmarksStore.isBookmarked(url);
  };

  public onLoadCommit = async ({
    url,
    isMainFrame,
  }: Electron.LoadCommitEvent) => {
    this.tab.loading = true;

    if (url !== this.lastURL && isMainFrame && !url.startsWith('wexond://')) {
      this.lastHistoryItemID = await store.historyStore.addItem({
        title: this.tab.title,
        url,
        favicon: this.tab.favicon,
        date: new Date().toString(),
      });

      this.lastURL = url;
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
            'build/webview-preload.js',
          )}`}
          allowFullScreen
        />
      </StyledPage>
    );
  }
}
