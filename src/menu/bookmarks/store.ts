import { observable } from 'mobx';

import { getFolderPath } from './utils/bookmarks';
import FolderModel from './models/folder';

class Store {
  @observable public data: FolderModel = null;

  @observable public selected: FolderModel = null;

  @observable public path: any = [];

  public updatePath = () => {
    if (this.selected == null) return;
    this.path = getFolderPath(this.selected);
  };
}

export default new Store();
