import { observer } from 'mobx-react';
import { resolve } from 'path';
import React from 'react';
import StyledPage from './styles';
import Page from '../../models/page';
import Tab from '../../models/tab';
import Store from '../../store';
import db from '../../../shared/models/app-database';
import { BASE_PATH } from '../../constants';

@observer
export default class extends React.Component<{ page: Page }, {}> {
  private lastURL = '';

  private lastHistoryItemID = -1;

  private webview: Electron.WebviewTag;

  private tab: Tab;

  public componentDidMount() {
    const { page } = this.props;
    const { id } = page;
    const tab = Store.getTabById(id);

    this.tab = tab;

    this.webview.addEventListener('did-stop-loading', this.onDidStopLoading);
    this.webview.addEventListener('did-navigate', this.onNavigate);
    this.webview.addEventListener('did-navigate-in-page', this.onNavigate);
    this.webview.addEventListener('will-navigate', this.onNavigate);
    this.webview.addEventListener('page-title-updated', this.onPageTitleUpdated);
    this.webview.addEventListener('load-commit', this.onLoadCommit);
    this.webview.addEventListener('page-favicon-updated', this.onPageFaviconUpdated);
    this.webview.addEventListener('dom-ready', this.onDomReady);
    this.webview.addEventListener('enter-html-full-screen', this.onFullScreenEnter);
    this.webview.addEventListener('leave-html-full-screen', this.onFullScreenLeave);
  }

  public componentWillUnmount() {
    this.webview.removeEventListener('did-stop-loading', this.onDidStopLoading);
    this.webview.removeEventListener('did-navigate', this.onNavigate);
    this.webview.removeEventListener('did-navigate-in-page', this.onNavigate);
    this.webview.removeEventListener('will-navigate', this.onNavigate);
    this.webview.removeEventListener('page-title-updated', this.onPageTitleUpdated);
    this.webview.removeEventListener('load-commit', this.onLoadCommit);
    this.webview.removeEventListener('page-favicon-updated', this.onPageFaviconUpdated);
    this.webview.removeEventListener('enter-html-full-screen', this.onFullScreenEnter);
    this.webview.removeEventListener('leave-html-full-screen', this.onFullScreenLeave);

    Store.isFullscreen = false;
  }

  public onContextMenu = (e: Electron.Event, params: Electron.ContextMenuParams) => {
    requestAnimationFrame(() => {
      Store.pageMenu.toggle(true);
    });

    Store.webviewContextMenuParams = params;

    // Calculate new menu position
    // using cursor x, y and
    // width, height of the menu.
    const x = Store.mouse.x;
    const y = Store.mouse.y;

    // By default it opens menu from upper left corner.
    let left = x;
    let top = y;

    const width = 3 * 64;
    const height = Store.pageMenu.getHeight();

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
    Store.pageMenuData.x = left;
    Store.pageMenuData.y = top;
  };

  public onDomReady = () => {
    this.webview.getWebContents().on('context-menu', this.onContextMenu);
    this.webview.removeEventListener('dom-ready', this.onDomReady);
  };

  public onDidStopLoading = (e: Electron.Event) => {
    this.onNavigate(e as any);
    this.tab.loading = false;
  };

  public onNavigate = ({ isMainFrame, url }: any) => {
    Store.refreshNavigationState();

    if (!isMainFrame && !url) return;
    this.tab.url = url;
    this.updateData();
  };

  public onLoadCommit = async ({ url, isMainFrame }: Electron.LoadCommitEvent) => {
    this.tab.loading = true;

    if (url !== this.lastURL && isMainFrame && !url.startsWith('wexond://')) {
      db.transaction('rw', db.history, async () => {
        const id = await db.history.add({
          title: this.tab.title,
          url,
          favicon: this.tab.favicon,
          date: new Date().toString(),
        });

        this.lastHistoryItemID = id;
      });

      this.lastURL = url;
    }

    const isSavedAsBookmark = (await db.bookmarks
      .where('url')
      .equals(url)
      .count()) > 0;

    this.tab.isSavedAsBookmark = isSavedAsBookmark;
  };

  public onPageFaviconUpdated = ({ favicons }: Electron.PageFaviconUpdatedEvent) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = async () => {
      if (request.readyState === 4) {
        if (request.status === 404) {
          this.tab.favicon = '';
        } else {
          this.tab.favicon = favicons[0];
          db.addFavicon(favicons[0]);
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
        db.transaction('rw', db.history, async () => {
          db.history
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
    const tab = Store.getTabById(id);

    tab.title = title;
    this.updateData();
  };

  public onFullScreenEnter = () => {
    Store.isFullscreen = true;
  };

  public onFullScreenLeave = () => {
    Store.isFullscreen = false;
  };

  public render() {
    const { page } = this.props;
    const { url, id } = page;

    return (
      <StyledPage selected={Store.getCurrentWorkspace().selectedTab === id}>
        <webview
          src={url}
          style={{ height: '100%' }}
          ref={(r: Electron.WebviewTag) => {
            page.webview = r;
            this.webview = r;
          }}
          preload={`file://${resolve(BASE_PATH, 'src/app/preloads/index.js')}`}
          allowFullScreen
        />
      </StyledPage>
    );
  }
}
