import { observable } from 'mobx';

import BookmarkItem from '../../shared/models/bookmark-item';
import { getPath } from './utils';

class Store {
  @observable public currentTree: number = -1;

  @observable public path: BookmarkItem[] = [];

  @observable public selectedItems: number[] = [];

  @observable public bookmarks: BookmarkItem[] = [];

  public goTo = (id: number) => {
    this.currentTree = id;
    this.path = getPath(id);
  };
}

export default new Store();
