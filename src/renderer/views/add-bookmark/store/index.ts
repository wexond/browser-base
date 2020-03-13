import { ipcRenderer } from 'electron';
import { observable } from 'mobx';
import { IBookmark } from '~/interfaces';
import * as React from 'react';
import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {
  @observable
  public folders: IBookmark[] = [];

  @observable
  public dialogTitle = '';

  public titleRef = React.createRef<HTMLInputElement>();

  public bookmark: IBookmark;

  @observable
  public currentFolder: IBookmark;

  public constructor() {
    super();

    (async () => {
      this.folders = await ipcRenderer.invoke('bookmarks-get-folders');
      this.currentFolder = this.folders.find(x => x.static === 'main');
    })();
  }

  public async onVisibilityChange(visible: boolean, data: any) {
    this.visible = visible;

    if (visible) {
      const { bookmark, title, url, favicon } = data;

      this.bookmark = bookmark;
      this.folders = await ipcRenderer.invoke('bookmarks-get-folders');

      if (!this.bookmark) {
        this.bookmark = await ipcRenderer.invoke('bookmarks-add', {
          title,
          url,
          favicon,
          parent: this.folders[0]._id,
        });
        this.dialogTitle = 'Bookmark added';
      } else {
        this.dialogTitle = 'Edit bookmark';
      }

      if (this.titleRef.current) {
        this.titleRef.current.value = title;
        this.titleRef.current.focus();
        this.titleRef.current.select();
      }
    }
  }
}

export default new Store();
