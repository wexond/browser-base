import { observable } from 'mobx';

export class BookmarksStore {
  @observable
  public bookmarks: BookmarkItem[] = [];

  @observable
  public dialogVisible = false;

  @observable
  public currentTree = -1;

  @observable
  public path: BookmarkItem[] = [];

  @observable
  public selectedItems: number[] = [];

  public bookmarkDialogRef: BookmarksDialog;

  public goToBookmarkFolder = (id: number) => {
    this.currentTree = id;
    this.path = getBookmarkFolderPath(id);
  };
}
