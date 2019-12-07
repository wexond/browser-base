import { observable, computed, action, toJS } from 'mobx';
import { ISettings, IFavicon, ITheme, IBookmark } from '~/interfaces';
import { getTheme } from '~/utils/themes';
import { PreloadDatabase } from '~/preloads/models/database';
import { ipcRenderer } from 'electron';

export class Store {
  @observable
  public settings: ISettings = { ...(window as any).settings };

  @computed
  public get theme(): ITheme {
    return getTheme(this.settings.theme);
  }

  @observable
  public list: IBookmark[] = [];

  @observable
  public itemsLoaded = this.getDefaultLoaded();

  @observable
  public menuLeft = 0;

  @observable
  public menuTop = 0;

  @observable
  public menuVisible = false;

  @observable
  public searched = '';

  @observable
  public selectedItems: string[] = [];

  @observable
  public favicons: Map<string, string> = new Map();

  @observable
  public currentFolder: string = null;

  @computed
  public get visibleItems() {
    return this.list
      .filter(
        x =>
          (this.searched !== '' &&
            ((x.url &&
              x.url.toLowerCase().includes(this.searched.toLowerCase())) ||
              (x.title &&
                x.title
                  .toLowerCase()
                  .includes(this.searched.toLowerCase())))) ||
          (this.searched === '' && x.parent === this.currentFolder),
      )
      .slice()
      .sort((a, b) => {
        return a.order - b.order;
      });
  }

  public currentBookmark: IBookmark;

  public faviconsDb = new PreloadDatabase<IFavicon>('favicons');

  public constructor() {
    (window as any).updateSettings = (settings: ISettings) => {
      this.settings = { ...this.settings, ...settings };
    };

    this.load();
    this.loadFavicons();

    window.addEventListener('resize', () => {
      const loaded = this.getDefaultLoaded();

      if (loaded > this.itemsLoaded) {
        this.itemsLoaded = loaded;
      }
    });

    window.addEventListener('mousedown', () => {
      this.menuVisible = false;
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

  public resetLoadedItems(): void {
    this.itemsLoaded = this.getDefaultLoaded();
  }

  public getById(id: string) {
    return this.list.find(x => x._id === id);
  }

  public async load() {
    this.list = await ipcRenderer.invoke('bookmarks-get');
    this.currentFolder = this.list.find(x => x.static === 'main')._id;
  }

  public async loadFavicons() {
    (await this.faviconsDb.get({})).forEach(favicon => {
      const { data } = favicon;

      if (this.favicons.get(favicon.url) == null) {
        this.favicons.set(favicon.url, data);
      }
    });
  }

  public removeItems(ids: string[]) {
    this.list = this.list.filter(x => !ids.includes(x._id));
    ipcRenderer.send(
      'bookmarks-remove',
      toJS(ids, { recurseEverything: true }),
    );
  }

  public async addItem(item: IBookmark) {
    const i = await ipcRenderer.invoke('bookmarks-add', item);
    this.list.push(i);
    return i;
  }

  public async updateItem(id: string, change: IBookmark) {
    const index = this.list.indexOf(this.list.find(x => x._id === id));
    this.list[index] = { ...this.list[index], ...change };
    ipcRenderer.send(
      'bookmarks-update',
      id,
      toJS(change, { recurseEverything: true }),
    );
  }

  @action
  public search(str: string) {
    this.searched = str.toLowerCase().toLowerCase();
    this.itemsLoaded = this.getDefaultLoaded();
  }

  public getDefaultLoaded() {
    return Math.floor(window.innerHeight / 48);
  }

  @action
  public deleteSelected() {
    this.removeItems(this.selectedItems);
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

export default new Store();
