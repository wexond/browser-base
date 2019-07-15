import * as Datastore from 'nedb';
import { observable, computed, action } from 'mobx';
import { getPath } from '~/utils/paths';
import { IBookmark } from '~/interfaces';

export class BookmarksStore {
  public db = new Datastore({
    filename: getPath('storage/bookmarks.db'),
    autoload: true,
  });

  @observable
  public list: IBookmark[] = [];

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

  @observable
  public currentFolder: string = null;

  @observable
  public path: IBookmark[] = [];

  public currentBookmark: IBookmark;

  @computed
  public get visibleItems() {
    return this.list
      .filter(
        x =>
          ((x.url && x.url.includes(this.searched)) ||
            x.title.includes(this.searched)) &&
          x.parent === this.currentFolder,
      )
      .sort((a, b) => a.order - b.order);
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
    await this.db.find({}).exec((err: any, items: IBookmark[]) => {
      if (err) return console.warn(err);
      this.list = items;
    });
  }

  public addItem(item: IBookmark) {
    return new Promise((resolve: (id: string) => void) => {
      const order = this.list.filter(x => x.parent === null).length;
      item.order = order;

      this.db.insert(item, (err: any, doc: IBookmark) => {
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

  public goToFolder(id: string) {
    this.currentFolder = id;
    this.path = this.getFolderPath(id);
  }

  public getFolderPath(parent: string) {
    const parentFolder = this.list.find(x => x._id === parent);
    let path: IBookmark[] = [];

    if (parentFolder == null) return [];

    if (parentFolder.parent != null) {
      path = path.concat(this.getFolderPath(parentFolder.parent));
    }

    path.push(parentFolder);
    return path;
  }
}
