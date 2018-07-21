import { observable } from 'mobx';

import BookmarkItem from '../../shared/models/bookmark-item';
import { getPath } from './utils';

class Store {
  @observable public bookmarks: BookmarkItem[] = [];

  @observable public currentTree: number = -1;

  @observable public path: BookmarkItem[] = [];

  @observable public selectedItems: number[] = [];

  public goTo = (id: number) => {
    this.currentTree = id;
    this.path = getPath(id);
  };
}

export default new Store();
