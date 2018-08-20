import { remote } from 'electron';
import { observer } from 'mobx-react';
import { resolve } from 'path';
import React from 'react';

import StyledPage from './styles';
import { Page, Tab } from '../../models';
import store from '@app/store';
import { PageMenuMode } from '~/enums';

@observer
export default class extends React.Component<{ page: Page }> {
  private lastURL = '';
  private lastHistoryItemID = -1;
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

    // Calculate new menu position
    // using cursor x, y and
    // width, height of the menu.
    const x = store.mouse.x;
    const y = store.mouse.y;

    // By default it opens menu from upper left corner.
    let left = x;
    let top = y;

    const width = 3 * 64;
    const height = store.pageMenuStore.ref.getHeight();

    // Open menu from right corner.
    if (left + width > window.innerWidth) {
      left = x - width;
    }

    // Open menu from bottom corner.
    if (top + height > window.innerHeight) {
      top = y - height;
    }

    if (top < 0) {
      top = 96;
    }

    // Set the new position.
    store.pageMenuStore.x = left;
    store.pageMenuStore.y = top;
  };

  public onDidStopLoading = () => {
    store.navigationStateStore.refresh();
    this.tab.loading = false;
  };

  public onLoadCommit = async ({
    url,
    isMainFrame,
  }: Electron.LoadCommitEvent) => {
    this.tab.loading = true;

    if (url !== this.lastURL && isMainFrame && !url.startsWith('wexond://')) {
      // TODO: nedb
      /*database.transaction('rw', database.history, async () => {
        const id = await database.history.add({
          title: this.tab.title,
          url,
          favicon: this.tab.favicon,
          date: new Date().toString(),
        });

        this.lastHistoryItemID = id;
      });*/

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
          // TODO: nedb
          // database.addFavicon(favicons[0]);
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
    if (this.lastURL === this.tab.url) {
      if (this.lastHistoryItemID !== -1) {
        // TODO: nedb
        /*database.transaction('rw', database.history, async () => {
          database.history
            .where('id')
            .equals(this.lastHistoryItemID)
            .modify({
              title: this.tab.title,
              url: this.webview.getURL(),
              favicon: this.tab.favicon,
            });
        });*/
      }
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
      <StyledPage
        selected={store.tabsStore.getCurrentGroup().selectedTab === id}
      >
        <webview
          src={url}
          style={{
            height: '100%',
          }}
          ref={(r: Electron.WebviewTag) => {
            page.webview = r;
            this.webview = r;
          }}
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
