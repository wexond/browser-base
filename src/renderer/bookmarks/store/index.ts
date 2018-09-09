import { observable } from 'mobx';
import { Bookmark } from '@/interfaces';

export class Store {
  @observable
  public bookmarks: Bookmark[] = [];

  @observable
  public currentTree: string = null;

  @observable
  public path: Bookmark[] = [];

  @observable
  public selectedItems: string[] = [];

  @observable
  public dragged: Bookmark;

  @observable
  public draggedVisible = false;

  @observable
  public mousePos: { x: number; y: number } = null;

  @observable
  public hovered: Bookmark;

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
}

export default new Store();
