import { observable, computed } from 'mobx';
import os from 'os';
import { remote } from 'electron';

import { AddressBarStore } from './address-bar';
import { MenuStore } from './menu';
import { TabsStore } from './tabs';
import { TabbarStore } from './tabbar';
import { TabGroupsStore } from './tab-groups';
import { PageMenuStore } from './page-menu';
import { HistoryStore } from './history';
import { BookmarksStore } from './bookmarks';
import { AddTabStore } from './add-tab';
import { SuggestionsStore } from './suggestions';
import { KeyboardShortcutsStore } from './keyboard-shortcuts';
import { Platforms } from '../../../enums';
import { PagesStore } from './pages';
import { NavigationStateStore } from './navigation-state';
import { FaviconsStore } from './favicons';
import { ExtensionsStore } from './extensions';
import { readFileSync } from 'fs';
import { Dictionary } from '../../../interfaces';

export class Store {
  public tabbarStore = new TabbarStore();
  public tabGroupsStore = new TabGroupsStore();
  public tabsStore = new TabsStore();
  public pagesStore = new PagesStore();
  public menuStore = new MenuStore();
  public addressBarStore = new AddressBarStore();
  public pageMenuStore = new PageMenuStore();
  public historyStore = new HistoryStore();
  public bookmarksStore = new BookmarksStore();
  public addTabStore = new AddTabStore();
  public suggestionsStore = new SuggestionsStore();
  public keyboardShortcutsStore = new KeyboardShortcutsStore();
  public navigationStateStore = new NavigationStateStore();
  public faviconsStore = new FaviconsStore();
  public extensionsStore = new ExtensionsStore();

  @observable
  public isFullscreen = false;

  @observable
  public isHTMLFullscreen = false;

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
  public locale: string = remote.getGlobal('locale');

  public platform = os.platform() as Platforms;
  public cmdPressed = false;
  public mouse = {
    x: 0,
    y: 0,
  };

  @computed
  get dictionary(): Dictionary {
    return JSON.parse(
      readFileSync(
        `../../../../static/dictionaries/${this.locale}.json`,
        'utf8',
      ),
    );
  }
}

export default new Store();
