import { observable } from 'mobx';

import { getFolderPath } from './utils/bookmarks';

class Store {
  @observable public data: any = {};

  @observable public selected: any = null;

  @observable public path: any = [];

  public updatePath(): void {
    if (this.selected == null) return;
    this.path = getFolderPath(this.selected);
  }
}

export default new Store();
