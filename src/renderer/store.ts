import { observable } from 'mobx';
import os from 'os';
import { Platforms, ContextMenuMode } from './enums';
import AddressBar from './models/address-bar';
import Page from './models/page';
import Workspace from './models/workspace';
import Menu from './models/menu';
import SuggestionItem from './models/suggestion-item';
import BookmarkItem from './models/bookmark-item';
import HistoryItem from './models/history-item';
import { getBookmarkFolderPath } from './utils/bookmarks';
import ContextMenu from './components/ContextMenu';
import BookmarksDialog from './views/app/BookmarksDialog';
import database from './database';

const dictionary = require('../static/dictionaries/english-en.json');

class Store {
  /** Workspaces */
  @observable
  public workspaces: Workspace[] = [];

  @observable
  public selectedWorkspace = 0;

  @observable
  public workspacesMenuVisible = false;

  /** */
  @observable
  public pages: Page[] = [];

  /** Suggestions */
  @observable
  public suggestions: SuggestionItem[] = [];

  @observable
  public selectedSuggestion = 0;

  /** */
  @observable
  public addressBar = new AddressBar();

  /** Menu */
  @observable
  public menu = new Menu();

  /** */
  @observable
  public isFullscreen = false;

  @observable
  public isHTMLFullscreen = false;

  @observable
  public isTabDragged = false;

  /** Bookmarks */
  @observable
  public bookmarks: BookmarkItem[] = [];

  @observable
  public isBookmarked = false;

  @observable
  public bookmarkDialogVisible = false;

  @observable
  public currentBookmarksTree = -1;

  @observable
  public bookmarksPath: BookmarkItem[] = [];

  @observable
  public selectedBookmarkItems: number[] = [];

  /** History */
  @observable
  public historyItems: HistoryItem[] = [];

  @observable
  public selectedHistoryItems: number[] = [];

  /** */
  @observable
  public updateInfo = {
    available: false,
    version: '',
  };

  @observable
  public tabbarScrollbar = {
    visible: false,
    thumbWidth: 0,
    thumbLeft: 0,
    thumbVisible: false,
    thumbDragging: false,
  };

  @observable
  public navigationState = {
    canGoBack: false,
    canGoForward: false,
  };

  @observable
  public pageMenuData = {
    x: 0,
    y: 0,
    mode: ContextMenuMode.Normal,
  };

  @observable
  public dictionary: any = dictionary;

  /** Components refs */
  public pageMenu: ContextMenu;

  public bookmarkDialog: BookmarksDialog;

  /** */
  public webviewContextMenuParams: Electron.ContextMenuParams;

  public favicons: { [key: string]: string } = {};

  public platform = os.platform() as Platforms;

  public mouse = {
    x: 0,
    y: 0,
  };

  public cmdPressed = false;

  /** Methods */

  /** Workspaces */
  public getCurrentWorkspace() {
    return this.getWorkspaceById(this.selectedWorkspace);
  }

  public getWorkspaceById(id: number) {
    return this.workspaces.filter(workspace => workspace.id === id)[0];
  }

  public addWorkspace() {
    this.workspaces.push(new Workspace());
  }

  /** Tabs */
  public getTabById(id: number) {
    for (const workspace of this.workspaces) {
      const tab = workspace.getTabById(id);
      if (tab) {
        return tab;
      }
    }

    return null;
  }

  public getSelectedTab() {
    return this.getCurrentWorkspace().getSelectedTab();
  }

  /** Pages */
  public getPageById(id: number) {
    return this.pages.filter(page => page.id === id)[0];
  }

  public getSelectedPage() {
    return this.getPageById(this.getCurrentWorkspace().getSelectedTab().id);
  }

  public addPage(tabId: number, url: string) {
    const page = new Page(tabId, url);
    const index = this.pages.push(page) - 1;

    return this.pages[index];
  }

  /** */
  public refreshNavigationState() {
    const page = this.getSelectedPage();
    if (page) {
      const { webview } = this.getSelectedPage();

      if (webview && webview.getWebContents()) {
        this.navigationState = {
          canGoBack: webview.canGoBack(),
          canGoForward: webview.canGoForward(),
        };
      }
    }
  }

  public loadFavicons() {
    return new Promise(async (resolve, reject) => {
      await database.favicons.each(favicon => {
        if (this.favicons[favicon.url] == null && favicon.favicon.byteLength !== 0) {
          this.favicons[favicon.url] = window.URL.createObjectURL(new Blob([favicon.favicon]));
        }
      });
    });
  }

  /** Bookmarks */
  public goToBookmarkFolder = (id: number) => {
    this.currentBookmarksTree = id;
    this.bookmarksPath = getBookmarkFolderPath(id);
  };
}

export default new Store();
