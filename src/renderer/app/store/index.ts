import { observable } from 'mobx';
import { TabsStore } from './tabs';
import { TabGroupsStore } from './tab-groups';
import { AddTabStore } from './add-tab';
import { ipcRenderer } from 'electron';

export class Store {
  public addTabStore = new AddTabStore();
  public tabGroupsStore = new TabGroupsStore();
  public tabsStore = new TabsStore();

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
  public overlayVisible = false;

  @observable
  public overlayBottom = 275;

  @observable
  public overlayExpanded = false;

  @observable
  public overlayTransition = true;

  public usingTrackpad = false;

  public mouse = {
    x: 0,
    y: 0,
  };

  public canToggleMenu = false;

  constructor() {
    ipcRenderer.on(
      'update-navigation-state',
      (e: Electron.IpcMessageEvent, data: any) => {
        this.navigationState = data;
      },
    );

    ipcRenderer.on('scroll-touch-begin', () => {
      this.usingTrackpad = true;
    });

    ipcRenderer.on('scroll-touch-end', () => {
      this.usingTrackpad = false;
    });
  }
}

export default new Store();
