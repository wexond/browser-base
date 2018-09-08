import { observable } from 'mobx';
import { Bookmark } from '@/interfaces';

declare const global: any;

export class Store {
  @observable
  public bookmarks: Bookmark[] = [];

  @observable
  public currentTree: string;

  @observable
  public path: Bookmark[] = [];

  @observable
  public selectedItems: string[] = [];

  public goToFolder(id: string) {
    this.currentTree = id;
    this.path = this.getFolderPath(id);
  }

  public getFolderPath(parent: string) {
    const parentFolder = this.bookmarks.find(x => x._id === parent);
    let path: Bookmark[] = [];

    if (parentFolder == null) return [];

    if (parentFolder.parent != null) {
      path = path.concat(this.getFolderPath(parentFolder.parent));
    }

    path.push(parentFolder);

    return path;
  }

  public search(str: string) {}

  public removeItem(...ids: string[]) {
    global.wexondPages.bookmarks.delete(...ids);
  }
}

export default new Store();
