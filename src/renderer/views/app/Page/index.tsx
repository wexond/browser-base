import { observer } from 'mobx-react';
import { resolve } from 'path';
import React from 'react';
import StyledPage from './styles';
import Page from '../../../models/page';
import Tab from '../../../models/tab';
import store from '../../../store';
import { ContextMenuMode } from '../../../enums';
import database from '../../../database';
import { BASE_PATH } from '../../../constants';
import Newtab from '../../newtab/Newtab';

@observer
export default class extends React.Component<{ page: Page }, {}> {
  private lastURL = '';

  private lastHistoryItemID = -1;

  private webview: Electron.WebviewTag;

  private tab: Tab;

  private onURLChange: any;

  public componentDidMount() {
    const { page } = this.props;
    const { id } = page;
    const tab = store.getTabById(id);

    this.tab = tab;

    this.webview.addEventListener('did-stop-loading', this.onDidStopLoading);
    this.webview.addEventListener('page-title-updated', this.onPageTitleUpdated);
    this.webview.addEventListener('load-commit', this.onLoadCommit);
    this.webview.addEventListener('page-favicon-updated', this.onPageFaviconUpdated);
    this.webview.addEventListener('dom-ready', this.onDomReady);
    this.webview.addEventListener('enter-html-full-screen', this.onFullscreenEnter);
    this.webview.addEventListener('leave-html-full-screen', this.onFullscreenLeave);
    this.webview.addEventListener('new-window', this.onNewWindow);

    // Custom event: fires when webview URL changes.
    this.onURLChange = setInterval(() => {
      const url = this.webview.getURL();
      if (url !== tab.url) {
        this.tab.isNew = false;
        this.tab.url = url;
        this.updateData();
        store.isBookmarked = !!store.bookmarks.find(x => x.url === url);
      }
    }, 10);
  }

  public componentWillUnmount() {
    this.webview.removeEventListener('did-stop-loading', this.onDidStopLoading);
    this.webview.removeEventListener('page-title-updated', this.onPageTitleUpdated);
    this.webview.removeEventListener('load-commit', this.onLoadCommit);
    this.webview.removeEventListener('page-favicon-updated', this.onPageFaviconUpdated);
    this.webview.removeEventListener('enter-html-full-screen', this.onFullscreenEnter);
    this.webview.removeEventListener('leave-html-full-screen', this.onFullscreenLeave);
    this.webview.removeEventListener('new-window', this.onNewWindow);

    clearInterval(this.onURLChange);

    store.isFullscreen = false;
  }

  public onNewWindow = (e: Electron.NewWindowEvent) => {
    if (e.disposition === 'new-window' || e.disposition === 'foreground-tab') {
      store.getCurrentWorkspace().addTab(e.url, true);
    } else if (e.disposition === 'background-tab') {
      store.getCurrentWorkspace().addTab(e.url, false);
    }
  };

  public onContextMenu = (e: Electron.Event, params: Electron.ContextMenuParams) => {
    requestAnimationFrame(() => {
      store.pageMenu.toggle(true);
    });

    store.webviewContextMenuParams = params;

    if (params.linkURL && params.hasImageContents) {
      store.pageMenuData.mode = ContextMenuMode.ImageAndURL;
    } else if (params.linkURL) {
      store.pageMenuData.mode = ContextMenuMode.URL;
    } else if (params.hasImageContents) {
      store.pageMenuData.mode = ContextMenuMode.Image;
    } else {
      store.pageMenuData.mode = ContextMenuMode.Normal;
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
    const height = store.pageMenu.getHeight();

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
    store.pageMenuData.x = left;
    store.pageMenuData.y = top;
  };

  public onDomReady = () => {
    this.webview.getWebContents().on('context-menu', this.onContextMenu);
    this.webview.send('get-extensions', store.extensions);
  };

  public onDidStopLoading = () => {
    store.refreshNavigationState();
    this.tab.loading = false;
  };

  public onLoadCommit = async ({ url, isMainFrame }: Electron.LoadCommitEvent) => {
    this.tab.loading = true;

    if (url !== this.lastURL && isMainFrame && !url.startsWith('wexond://')) {
      database.transaction('rw', database.history, async () => {
        const id = await database.history.add({
          title: this.tab.title,
          url,
          favicon: this.tab.favicon,
          date: new Date().toString(),
        });

        this.lastHistoryItemID = id;
      });

      this.lastURL = url;
    }
  };

  public onPageFaviconUpdated = ({ favicons }: Electron.PageFaviconUpdatedEvent) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = async () => {
      if (request.readyState === 4) {
        if (request.status === 404) {
          this.tab.favicon = '';
        } else {
          this.tab.favicon = favicons[0];
          database.addFavicon(favicons[0]);
        }
      }
      this.updateData();
    };

    request.open('GET', favicons[0], true);
    request.send(null);
  };

  public updateData = () => {
    if (this.lastURL === this.tab.url) {
      if (this.lastHistoryItemID !== -1) {
        database.transaction('rw', database.history, async () => {
          database.history
            .where('id')
            .equals(this.lastHistoryItemID)
            .modify({
              title: this.tab.title,
              url: this.webview.getURL(),
              favicon: this.tab.favicon,
            });
        });
      }
    }
  };

  public onPageTitleUpdated = ({ title }: Electron.PageTitleUpdatedEvent) => {
    const { page } = this.props;
    const { id } = page;
    const tab = store.getTabById(id);

    tab.title = title;
    this.updateData();
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
      <StyledPage selected={store.getCurrentWorkspace().selectedTab === id}>
        <webview
          src={url}
          style={{
            height: '100%',
          }}
          ref={(r: Electron.WebviewTag) => {
            page.webview = r;
            this.webview = r;
          }}
          preload={`file://${resolve(BASE_PATH, 'src/preloads/webview-preload.js')}`}
          allowFullScreen
        />
      </StyledPage>
    );
  }
}
