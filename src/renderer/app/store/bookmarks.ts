import * as Datastore from 'nedb';
import { observable, computed, action } from 'mobx';
import { HistoryItem, HistorySection } from '../models';
import { getPath } from '~/shared/utils/paths';

export class BookmarksStore {
  public db = new Datastore({
    filename: getPath('storage/bookmarks.db'),
    autoload: true,
  });

  @observable
  public list: HistoryItem[] = [];

  @observable
  public itemsLoaded = this.getDefaultLoaded();

  @observable
  public searched = '';

  @observable
  public selectedItems: string[] = [];

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
    await this.db.find({}).exec((err: any, items: HistoryItem[]) => {
      if (err) return console.warn(err);

      items = items.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      this.list = items;
    });
  }

  public addItem(item: HistoryItem) {
    return new Promise((resolve: (id: string) => void) => {
      this.db.insert(item, (err: any, doc: HistoryItem) => {
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

  public deleteSelected() {
    for (const item of this.selectedItems) {
      this.removeItem(item);
    }
    this.selectedItems = [];
  }
}
