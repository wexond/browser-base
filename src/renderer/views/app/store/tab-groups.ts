import { observable, action } from 'mobx';

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

export class TabGroupsStore {
  @observable
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
    this.store = store;
  }

  public getGroupById(id: number) {
    return this.list.find(x => x.id === id);
  }

  @action
  public addGroup() {
    const tabGroup = new ITabGroup(this.store, this);
    this.list.push(tabGroup);
    return tabGroup;
  }
}
