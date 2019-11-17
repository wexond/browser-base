import { observable, action } from 'mobx';

import { ITabGroup } from '../models';
import { Store } from '.';
import { BLUE_500 } from '~/renderer/constants';

export class TabGroupsStore {
  @observable
  public list: ITabGroup[] = [];

  public palette: string[] = [BLUE_500];

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
