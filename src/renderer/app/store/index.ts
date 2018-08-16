import { observable } from 'mobx';
import os from 'os';
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

export class Store {
  public tabbarStore = new TabbarStore();
  public tabGroupsStore = new TabGroupsStore();
  public tabsStore = new TabsStore();
  public menuStore = new MenuStore();
  public addressBarStore = new AddressBarStore();
  public pageMenuStore = new PageMenuStore();
  public historyStore = new HistoryStore();
  public bookmarksStore = new BookmarksStore();
  public addTabStore = new AddTabStore();
  public suggestionsStore = new SuggestionsStore();
  public keyboardShortcutsStore = new KeyboardShortcutsStore();

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

  public favicons: { [key: string]: string } = {};
  public platform = os.platform() as Platforms;
  public cmdPressed = false;
  public mouse = {
    x: 0,
    y: 0,
  };

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
    // TODO: nedb
    /*return new Promise(async resolve => {
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
    });*/
  }
}
