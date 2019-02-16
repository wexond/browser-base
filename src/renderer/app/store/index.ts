import { observable } from 'mobx';
import { TabsStore } from './tabs';
import { TabGroupsStore } from './tab-groups';
import { AddTabStore } from './add-tab';
import { ipcRenderer } from 'electron';
import { OverlayStore } from './overlay';
import { HistoryStore } from './history';
import { FaviconsStore } from './favicons';

export class Store {
  public historyStore = new HistoryStore();
  public faviconsStore = new FaviconsStore();
  public addTabStore = new AddTabStore();
  public tabGroupsStore = new TabGroupsStore();
  public tabsStore = new TabsStore();
  public overlayStore = new OverlayStore();

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

  public canToggleMenu = false;

  public mouse = {
    x: 0,
    y: 0,
  };

  constructor() {
    ipcRenderer.on(
      'update-navigation-state',
      (e: Electron.IpcMessageEvent, data: any) => {
        this.navigationState = data;
      },
    );
  }
}

export default new Store();
