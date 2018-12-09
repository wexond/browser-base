import { observable, computed } from 'mobx';
import { platform } from 'os';
import { remote } from 'electron';

import { AddressBarStore } from './address-bar';
import { MenuStore } from './menu';
import { TabsStore } from './tabs';
import { PageMenuStore } from './page-menu';
import { BookmarksStore } from './bookmarks';
import { AddTabStore } from './add-tab';
import { SuggestionsStore } from './suggestions';
import { Platforms } from '@/enums';
import { PagesStore } from './pages';
import { NavigationStateStore } from './navigation-state';
import { FaviconsStore } from './favicons';
import { ExtensionsStore } from './extensions';
import { dictionaries } from '@/constants/dictionaries';
import { KeyBindings } from './key-bindings';
import { HistoryStore } from './history';

export class Store {
  public tabsStore = new TabsStore();
  public pagesStore = new PagesStore();
  public menuStore = new MenuStore();
  public addressBarStore = new AddressBarStore();
  public pageMenuStore = new PageMenuStore();
  public historyStore = new HistoryStore();
  public bookmarksStore = new BookmarksStore();
  public addTabStore = new AddTabStore();
  public suggestionsStore = new SuggestionsStore();
  public navigationStateStore = new NavigationStateStore();
  public faviconsStore = new FaviconsStore();
  public extensionsStore = new ExtensionsStore();
  public keyBindings = new KeyBindings();

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
  public locale: string = remote.getGlobal('locale');

  public platform = platform() as Platforms;
  public cmdPressed = false;
  public mouse = {
    x: 0,
    y: 0,
  };

  @computed
  get dictionary() {
    return dictionaries[this.locale];
  }
}

export default new Store();
