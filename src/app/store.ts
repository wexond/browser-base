import { observable } from 'mobx';
import os from 'os';

// Enums
import { Platforms } from '../shared/enums';

// Models
import AddTabButton from './models/add-tab-button';
import Page from './models/page';
import TabGroup from './models/tab-group';
import AddressBar from './models/address-bar';
import Theme from './models/theme';
import SuggestionItem from './models/suggestion-item';

interface Suggestions {
  search: SuggestionItem[];
  history: SuggestionItem[];
  bookmarks: SuggestionItem[];
  mostVisited: SuggestionItem[];
}

class Store {
  // Observables
  @observable public selectedTabGroup = 0;
  @observable public tabGroups = [new TabGroup()];
  @observable public pages: Page[] = [];
  @observable public addTabButton = new AddTabButton();
  @observable public addressBar = new AddressBar();
  @observable public theme = new Theme();
  @observable
  public suggestions: Suggestions = {
    search: [],
    mostVisited: [],
    history: [],
    bookmarks: [],
  };

  public platform = os.platform() as Platforms;
  public mouse = {
    x: 0,
    y: 0,
  };

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
}

export default new Store();
