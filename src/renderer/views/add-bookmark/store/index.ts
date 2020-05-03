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
      this.currentFolder = this.folders.find((x) => x.static === 'main');
    })();

    ipcRenderer.on('data', async (e, data) => {
      const { bookmark, title, url, favicon } = data;

      if (!bookmark) {
        this.dialogTitle = !bookmark ? 'Bookmark added' : 'Edit bookmark';
      }

      this.bookmark = bookmark;
      this.folders = await ipcRenderer.invoke('bookmarks-get-folders');

      if (!this.bookmark) {
        this.bookmark = await ipcRenderer.invoke('bookmarks-add', {
          title,
          url,
          favicon,
          parent: this.folders.find((x) => x.static === 'main')._id,
        });
      }

      this.currentFolder = this.folders.find(
        (x) => x._id === this.bookmark.parent,
      );

      if (this.titleRef.current) {
        this.titleRef.current.value = title;
        this.titleRef.current.focus();
        this.titleRef.current.select();
      }
    });
  }
}

export default new Store();
