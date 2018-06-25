import { observable } from 'mobx';
import os from 'os';
import Tab, { TabProps } from './components/Tab';
import { Platforms } from './enums';
import AddTabButton from './models/add-tab-button';
import AddressBar from './models/address-bar';
import Page from './models/page';
import Suggestions from './models/suggestions';
import Workspace from './models/workspace';
import Theme from '../shared/models/theme';
import Menu from './models/menu';
import ContextMenu from '../shared/components/ContextMenu';

export interface Favicons {
  [key: string]: string;
}

class Store {
  // Observables
  @observable public selectedWorkspace = 0;

  @observable public workspaces = [new Workspace()];

  @observable public addTabButton = new AddTabButton();

  @observable public pages: Page[] = [];

  @observable public draggingTab = false;

  @observable public addressBar = new AddressBar();

  @observable public theme = new Theme();

  @observable public suggestions = new Suggestions();

  @observable public isFullscreen: boolean;

  @observable public menu = new Menu();

  @observable public pageMenu: ContextMenu;

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

  // Decorated components
  public decoratedTab: React.ComponentClass<TabProps> = Tab;

  public favicons: Favicons = {};

  public platform = os.platform() as Platforms;

  public mouse = {
    x: 0,
    y: 0,
  };

  public getTabBarWidth: () => number;

  public getCurrentWorkspace() {
    return this.getWorkspaceById(this.selectedWorkspace);
  }

  public getWorkspaceById(id: number) {
    return this.workspaces.filter(workspace => workspace.id === id)[0];
  }

  public getTabById(id: number) {
    const { workspaces } = this;

    const tabs = workspaces.map(workspace => workspace.getTabById(id));

    return tabs[0];
  }

  public getPageById(id: number) {
    return this.pages.filter(page => page.id === id)[0];
  }

  public getSelectedPage() {
    return this.getPageById(this.getCurrentWorkspace().getSelectedTab().id);
  }

  public addPage(tabId: number) {
    const page = new Page(tabId);
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
    this.workspaces.push(new Workspace());
  }
}

export default new Store();
