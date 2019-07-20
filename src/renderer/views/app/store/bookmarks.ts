import * as Datastore from 'nedb';
import { observable, computed, action } from 'mobx';
import { getPath } from '~/utils/paths';
import { IBookmark } from '~/interfaces';
import { promisify } from 'util';

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

  public currentBookmark: IBookmark;

  @observable
  private _bookmarksBar: string;

  @computed
  public get visibleItems() {
    return this.list
      .filter(
        x =>
          (this.searched !== '' &&
            ((x.url && x.url.includes(this.searched)) ||
              (x.title && x.title.includes(this.searched)))) ||
          (this.searched === '' && x.parent === this.currentFolder),
      )
      .slice()
      .sort((a, b) => b.order - a.order);
  }

  @computed
  public get path() {
    return this.getFolderPath(this.currentFolder);
  }

  @computed
  public get folders() {
    return this.list.filter(x => x.isFolder);
  }

  @computed
  public get barItems() {
    return this.list.filter(x => this.isBarItem(x._id));
  }

  private isBarItem(id: string): boolean {
    const item = this.list.find(x => x._id === id);
    if (!item) return false;

    if (item.parent === this._bookmarksBar) return true;
    return this.isBarItem(item.parent);
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
    const cursor = this.db.find({});
    const items: IBookmark[] = await promisify(cursor.exec.bind(cursor))();
    let barFolder = items.find(x => x.static === 'main');
    let otherFolder = items.find(x => x.static === 'other');
    let mobileFolder = items.find(x => x.static === 'mobile');

    this.list = items;

    if (!barFolder) {
      barFolder = await this.addItem({
        static: 'main',
        isFolder: true,
      });

      for (const item of items) {
        if (!item.static) {
          await this.updateItem(item._id, { parent: barFolder._id });
        }
      }
    }

    if (!otherFolder) {
      otherFolder = await this.addItem({
        static: 'other',
        isFolder: true,
      });
    }

    if (!mobileFolder) {
      mobileFolder = await this.addItem({
        static: 'mobile',
        isFolder: true,
      });
    }

    this._bookmarksBar = barFolder._id;
    this.currentFolder = barFolder._id;
  }

  public addItem(item: IBookmark): Promise<IBookmark> {
    return new Promise((resolve, reject) => {
      if (item.parent === undefined) {
        item.parent = null;
      }

      if (item.parent === null && !item.static) {
        return reject('Parent bookmark should be specified');
      }

      if (item.isFolder) {
        item.children = item.children || [];
      }

      item.order = this.list.filter(x => x.parent === null).length;

      this.db.insert(item, async (err: any, doc: IBookmark) => {
        if (err) return console.error(err);

        if (item.parent) {
          const parent = this.list.find(x => x._id === item.parent);
          await this.updateItem(parent._id, {
            children: [...parent.children, doc._id],
          });
        }

        this.list.push(doc);
        resolve(doc);
      });
    });
  }

  public removeItem(id: string) {
    const item = this.list.find(x => x._id === id);
    this.list = this.list.filter(x => x._id !== id);
    const parent = this.list.find(x => x._id === item.parent);

    parent.children = parent.children.filter(x => x !== id);
    this.updateItem(item.parent, { children: parent.children });

    this.db.remove({ _id: id }, err => {
      if (err) return console.warn(err);
    });

    if (item.isFolder) {
      this.list = this.list.filter(x => x.parent !== id);
      const removed = this.list.filter(x => x.parent === id);

      this.db.remove({ parent: id }, { multi: true }, err => {
        if (err) return console.warn(err);
      });

      for (const i of removed) {
        if (i.isFolder) {
          this.removeItem(i._id);
        }
      }
    }
  }

  public updateItem(id: string, change: IBookmark) {
    return new Promise(resolve => {
      const index = this.list.indexOf(this.list.find(x => x._id === id));
      this.list[index] = { ...this.list[index], ...change };

      this.db.update({ _id: id }, { $set: change }, {}, (err: any) => {
        if (err) return console.error(err);

        resolve();
      });
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

  private getFolderPath(parent: string) {
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
