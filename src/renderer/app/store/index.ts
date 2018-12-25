import { observable } from 'mobx';
import { TabsStore } from './tabs';
import { AddTabStore } from './add-tab';

export class Store {
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
