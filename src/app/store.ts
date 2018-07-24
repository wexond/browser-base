import { observable } from 'mobx';
import os from 'os';
import { Platforms } from './enums';
import AddressBar from './models/address-bar';
import Page from './models/page';
import Suggestions from './models/suggestions';
import Workspaces from './models/workspaces';
import Workspace from './models/workspace';
import Menu from './models/menu';
import ContextMenu from '../shared/components/ContextMenu';
import BookmarksDialog from './components/BookmarksDialog';
import BookmarkItem from '../shared/models/bookmark-item';
import Tab from './models/tab';

export interface Favicons {
  [key: string]: string;
}

class Store {
  // Observables
  @observable public workspaces = new Workspaces();

  @observable public pages: Page[] = [];

  @observable public draggingTab = false;

  @observable public addressBar = new AddressBar();

  @observable public suggestions = new Suggestions();

  @observable public isFullscreen: boolean;

  @observable public menu = new Menu();

  @observable public pageMenu: ContextMenu;

  @observable public bookmarksDialog: BookmarksDialog;

  @observable public bookmarksDialogVisible: boolean = false;

  @observable public bookmarks: BookmarkItem[] = [];

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
  };

  public webviewContextMenuParams: Electron.ContextMenuParams;

  public favicons: Favicons = {};

  public platform = os.platform() as Platforms;

  public mouse = {
    x: 0,
    y: 0,
  };

  public getCurrentWorkspace() {
    return this.getWorkspaceById(this.workspaces.selected);
  }

  public getWorkspaceById(id: number) {
    return this.workspaces.list.filter(workspace => workspace.id === id)[0];
  }

  public getTabById(id: number) {
    const { workspaces } = this;

    for (const workspace of workspaces.list) {
      const tab = workspace.getTabById(id);
      if (tab) {
        return tab;
      }
    }

    return null;
  }

  public getPageById(id: number) {
    return this.pages.filter(page => page.id === id)[0];
  }

  public getSelectedPage() {
    return this.getPageById(this.getCurrentWorkspace().getSelectedTab().id);
  }

  public getSelectedTab() {
    return this.getCurrentWorkspace().getSelectedTab();
  }

  public addPage(tabId: number, url: string) {
    const page = new Page(tabId, url);
    const index = this.pages.push(page) - 1;

    return this.pages[index];
  }

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

  public addWorkspace() {
    this.workspaces.list.push(new Workspace());
  }

  public getBookmarkFolders() {
    return this.bookmarks.filter(el => el.type === 'folder');
  }

  public isBookmarkSaved(url: string) {
    if (this.bookmarks == null) return false;
    return this.bookmarks.filter(r => r.url === url).length !== 0;
  }

  public isBookmarkSavedTab(tab?: Tab) {
    const workspace = this.getCurrentWorkspace();
    const selectedTab = workspace && workspace.getSelectedTab();

    if (tab == null) {
      if (selectedTab == null || selectedTab.bookmark == null) {
        return false;
      }

      return this.isBookmarkSaved(selectedTab.url);
    }

    return this.isBookmarkSaved(tab.url);
  }
}

export default new Store();
