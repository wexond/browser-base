import { observable, computed, action } from 'mobx';
import { IBookmark } from '~/interfaces';
import { Database } from '~/models/database';
import store from '.';

export class BookmarksStore {
  public db = new Database<IBookmark>('bookmarks');

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
  public dialCurrentFolder: string = null;

  public currentBookmark: IBookmark;

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
      .sort((a, b) => {
        return a.order - b.order;
      });
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
    return this.list
      .filter(x => x.parent === this.dialCurrentFolder)
      .slice()
      .sort((a, b) => {
        return a.order - b.order;
      });
  }

  public constructor() {
    this.load();
  }

  public resetLoadedItems() {
    this.itemsLoaded = this.getDefaultLoaded();
  }

  public getById(id: string) {
    return this.list.find(x => x._id === id);
  }

  public async load() {
    try {
      let items = await this.db.get({});

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

      this.currentFolder = barFolder._id;
      this.dialCurrentFolder = barFolder._id;
    } catch (e) {
      console.error(e);
    }
  }

  public async addItem(item: IBookmark): Promise<IBookmark> {
    if (item.parent === undefined) {
      item.parent = null;
    }

    if (item.parent === null && !item.static) {
      throw new Error('Parent bookmark should be specified');
    }

    if (item.isFolder) {
      item.children = item.children || [];
    }

    if (item.order === undefined) {
      item.order = this.list.filter(x => x.parent === null).length;
    }

    const doc = await this.db.insert(item);

    if (item.parent) {
      const parent = this.list.find(x => x._id === item.parent);
      await this.updateItem(parent._id, {
        children: [...parent.children, doc._id],
      });
    }

    this.list.push(doc);

    return doc;
  }

  public removeItem(id: string) {
    const item = this.list.find(x => x._id === id);
    this.list = this.list.filter(x => x._id !== id);
    const parent = this.list.find(x => x._id === item.parent);

    parent.children = parent.children.filter(x => x !== id);
    this.updateItem(item.parent, { children: parent.children });

    this.db.remove({ _id: id });

    if (item.isFolder) {
      this.list = this.list.filter(x => x.parent !== id);
      const removed = this.list.filter(x => x.parent === id);

      this.db.remove({ parent: id }, true);

      for (const i of removed) {
        if (i.isFolder) {
          this.removeItem(i._id);
        }
      }
    }
  }

  public async updateItem(id: string, change: IBookmark) {
    const index = this.list.indexOf(this.list.find(x => x._id === id));
    this.list[index] = { ...this.list[index], ...change };

    await this.db.update({ _id: id }, change);
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
