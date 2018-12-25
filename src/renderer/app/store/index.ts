import { observable } from 'mobx';
import { TabsStore } from './tabs';
import { AddTabStore } from './add-tab';
import { TabGroupsStore } from './tab-groups';

export class Store {
  public tabGroupsStore = new TabGroupsStore();
  public tabsStore = new TabsStore();
  public addTabStore = new AddTabStore();

  @observable
  public isFullscreen = false;

  @observable
  public isHTMLFullscreen = false;

  @observable
  public updateInfo = {
    available: false,
    version: '',
  };

  public mouse = {
    x: 0,
    y: 0,
  };
}

export default new Store();
