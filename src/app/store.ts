import { remote } from 'electron';
import { observable } from 'mobx';
import os from 'os';
import Tab, { TabProps } from './components/Tab';
import { Platforms } from './enums';
import AddTabButton from './models/add-tab-button';
import AddressBar from './models/address-bar';
import Page from './models/page';
import Suggestions from './models/suggestions';
import TabGroup from './models/tab-group';
import Theme from '../shared/models/theme';
import NavigationDrawer from './models/navigation-drawer';
import Menu from '../shared/components/Menu';

export interface Favicons {
  [key: string]: string;
}

class Store {
  // Observables
  @observable public selectedTabGroup = 0;
  @observable public tabGroups = [new TabGroup()];
  @observable public pages: Page[] = [];
  @observable public addTabButton = new AddTabButton();
  @observable public addressBar = new AddressBar();
  @observable public theme = new Theme();
  @observable public suggestions = new Suggestions();
  @observable public isFullscreen: boolean;
  @observable public navigationDrawer = new NavigationDrawer();

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

  public pageMenu: Menu;

  // Decorated components
  public decoratedTab: React.ComponentClass<TabProps> = Tab;

  public favicons: Favicons = {};
  public platform = os.platform() as Platforms;
  public mouse = {
    x: 0,
    y: 0,
  };

  public contextMenuParams: Electron.ContextMenuParams;

  public basePath = remote.app.getAppPath();

  public getTabBarWidth: () => number;

  public getCurrentTabGroup() {
    return this.getTabGroupById(this.selectedTabGroup);
  }

  public getTabGroupById(id: number) {
    return this.tabGroups.filter(tabGroup => tabGroup.id === id)[0];
  }

  public getTabById(id: number) {
    const { tabGroups } = this;

    const tabs = tabGroups.map(tabGroup => tabGroup.getTabById(id));

    return tabs[0];
  }

  public getPageById(id: number) {
    return this.pages.filter(page => page.id === id)[0];
  }

  public getSelectedPage() {
    return this.getPageById(this.getCurrentTabGroup().getSelectedTab().id);
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

  public addTabGroup() {
    this.tabGroups.push(new TabGroup());
  }
}

export default new Store();
