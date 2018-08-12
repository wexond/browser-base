import { observable } from 'mobx';
import os from 'os';

import database from '../database';
import { PageMenuMode, Platforms } from '../enums';
import {
  BookmarkItem,
  HistoryItem,
  KeyBinding,
  SuggestionItem,
  Workspace,
  Page,
} from '../interfaces';
import { AddressBar, Menu, Tab } from '../models';
import {
  getBookmarkFolderPath,
  getSelectedPage,
  updateTabsBounds,
} from '../utils';
import ContextMenu from './components/ContextMenu';
import BookmarksDialog from './views/app/BookmarksDialog';

const dictionary = require('../../static/dictionaries/english-en.json');

class Store {
  @observable
  public tabs: Tab[] = [];

  @observable
  public isTabDragged: boolean = false;

  @observable
  public workspaces: Workspace[] = [];

  @observable
  public currentWorkspace: number = 0;

  @observable
  public tabbarScrollbarVisible: boolean = false;

  public addTabLeft: number = 0;

  public addTabRef: HTMLDivElement;

  public tabbarRef: HTMLDivElement;

  public tabIndicatorRef: HTMLDivElement;

  public tabDragData = {
    lastMouseX: 0,
    dragging: false,
    mouseStartX: 0,
    tabStartX: 0,
    direction: '',
  };

  public lastTabbarScrollLeft: number = 0;

  @observable
  public workspacesMenuVisible = false;

  /** Suggestions */
  @observable
  public suggestions: SuggestionItem[] = [];

  @observable
  public selectedSuggestion = 0;

  /** Menu */
  @observable
  public menu = new Menu();

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
  public isFullscreen = false;

  @observable
  public isHTMLFullscreen = false;

  /** */
  @observable
  public addressBar = new AddressBar();

  /** */
  @observable
  public pages: Page[] = [];

  /** */
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

  @observable
  public pageMenuData = {
    x: 0,
    y: 0,
    mode: PageMenuMode.Normal,
  };

  @observable
  public pageMenuVisible: boolean = false;

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

  public keyBindings: KeyBinding[] = [];

  private rearrangeTabsTimer = {
    canReset: false,
    time: 0,
    interval: null as any,
  };

  constructor() {
    this.rearrangeTabsTimer.interval = setInterval(() => {
      // Set widths and positions for tabs 3 seconds after a tab was closed
      if (
        this.rearrangeTabsTimer.canReset &&
        this.rearrangeTabsTimer.time === 3
      ) {
        updateTabsBounds();
        this.rearrangeTabsTimer.canReset = false;
      }
      this.rearrangeTabsTimer.time++;
    }, 1000);
  }

  public resetRearrangeTabsTimer() {
    this.rearrangeTabsTimer.time = 0;
    this.rearrangeTabsTimer.canReset = true;
  }

  /** Methods */

  public refreshNavigationState() {
    const page = getSelectedPage();
    if (page) {
      const { webview } = getSelectedPage();

      if (webview && webview.getWebContents()) {
        this.navigationState = {
          canGoBack: webview.canGoBack(),
          canGoForward: webview.canGoForward(),
        };
      }
    }
  }

  public loadFavicons() {
    return new Promise(async resolve => {
      await database.favicons.each(favicon => {
        if (
          this.favicons[favicon.url] == null &&
          favicon.favicon.byteLength !== 0
        ) {
          this.favicons[favicon.url] = window.URL.createObjectURL(
            new Blob([favicon.favicon]),
          );
        }
      });
      resolve();
    });
  }

  /** Bookmarks */
  public goToBookmarkFolder = (id: number) => {
    this.currentBookmarksTree = id;
    this.bookmarksPath = getBookmarkFolderPath(id);
  }
}

export default new Store();
