import { observable, action, makeObservable } from 'mobx';

import { ITabGroup } from '../models';
import { Store } from '.';
import {
  BLUE_500,
  RED_500,
  PINK_500,
  PURPLE_500,
  DEEP_PURPLE_500,
  INDIGO_500,
  CYAN_500,
  LIGHT_BLUE_500,
  TEAL_500,
  GREEN_500,
  LIGHT_GREEN_500,
  LIME_500,
  YELLOW_500,
  AMBER_500,
  ORANGE_500,
  DEEP_ORANGE_500,
  BLUE_GRAY_500,
} from '~/renderer/constants';
import { ipcRenderer } from 'electron';

export class TabGroupsStore {
  public list: ITabGroup[] = [];

  public palette: string[] = [
    BLUE_500,
    RED_500,
    PINK_500,
    PURPLE_500,
    DEEP_PURPLE_500,
    INDIGO_500,
    CYAN_500,
    LIGHT_BLUE_500,
    TEAL_500,
    GREEN_500,
    LIGHT_GREEN_500,
    LIME_500,
    YELLOW_500,
    AMBER_500,
    ORANGE_500,
    DEEP_ORANGE_500,
    BLUE_GRAY_500,
  ];

  private store: Store;

  public constructor(store: Store) {
    makeObservable(this, { list: observable, addGroup: action });

    this.store = store;

    ipcRenderer.on('edit-tabgroup', (e, t) => {
      if (t) {
        const group = this.getGroupById(t.id);
        if (t.name != null) group.name = t.name;
        if (t.color) group.color = t.color;
        store.tabs.updateTabsBounds(true);
      }
    });
  }

  public getGroupById(id: number) {
    return this.list.find((x) => x.id === id);
  }

  public addGroup() {
    const tabGroup = new ITabGroup(this.store, this);
    this.list.push(tabGroup);
    return tabGroup;
  }

  public getGroups(): ITabGroup[] {
    return this.list;
  }
}
