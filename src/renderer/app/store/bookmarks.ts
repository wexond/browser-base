import * as Datastore from 'nedb';
import { observable, computed, action } from 'mobx';
import { getPath } from '~/shared/utils/paths';
import { Bookmark } from '../models/bookmark';

export class BookmarksStore {
  public db = new Datastore({
    filename: getPath('storage/bookmarks.db'),
    autoload: true,
  });

  @observable
  public list: Bookmark[] = [];

  @observable
  public itemsLoaded = this.getDefaultLoaded();

  @observable
  public searched = '';

  @observable
  public selectedItems: string[] = [];

  @observable
  public menuLeft: number = 0;

  @observable
  public menuTop: number = 0;

  @observable
  public menuVisible = false;

  public currentBookmark: Bookmark;

  @computed
  public get visibleItems() {
    return this.list.filter(
      x => x.url.includes(this.searched) || x.title.includes(this.searched),
    );
  }

  constructor() {
    this.load();
  }

  public resetLoadedItems() {
    this.itemsLoaded = this.getDefaultLoaded();
  }

  public getById(id: string) {
    return this.list.find(x => x._id === id);
  }

  public async load() {
    await this.db.find({}).exec((err: any, items: Bookmark[]) => {
      if (err) return console.warn(err);

      this.list = items;
    });
  }

  public addItem(item: Bookmark) {
    return new Promise((resolve: (id: string) => void) => {
      this.db.insert(item, (err: any, doc: Bookmark) => {
        if (err) return console.error(err);

        this.list.push(doc);
        resolve(doc._id);
      });
    });
  }

  public removeItem(id: string) {
    this.list = this.list.filter(x => x._id !== id);

    this.db.remove({ _id: id }, err => {
      if (err) return console.warn(err);
    });
  }

  @action
  public search(str: string) {
    this.searched = str.toLowerCase().toLowerCase();
    this.itemsLoaded = this.getDefaultLoaded();
  }

  public getDefaultLoaded() {
    return Math.floor(window.innerHeight / 56);
  }

  @action
  public deleteSelected() {
    for (const item of this.selectedItems) {
      this.removeItem(item);
    }
    this.selectedItems = [];
  }
}
