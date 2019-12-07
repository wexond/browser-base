import { ipcRenderer, remote } from 'electron';
import { observable, computed } from 'mobx';
import { getTheme } from '~/utils/themes';
import { ISettings, IBookmark } from '~/interfaces';
import { DEFAULT_SETTINGS } from '~/constants';
import * as React from 'react';

export class Store {
  @observable
  public settings: ISettings = DEFAULT_SETTINGS;

  @computed
  public get theme() {
    return getTheme(this.settings.theme);
  }

  @observable
  public visible = false;

  @observable
  public id = remote.getCurrentWebContents().id;

  @observable
  public windowId = remote.getCurrentWindow().id;

  @observable
  public folders: IBookmark[] = [];

  public titleRef = React.createRef<HTMLInputElement>();

  public bookmark: IBookmark;

  @observable
  public currentFolder: IBookmark;

  public constructor() {
    (async () => {
      this.folders = await ipcRenderer.invoke('bookmarks-get-folders');
      this.currentFolder = this.folders.find(x => x.static === 'main');
    })();

    ipcRenderer.on('visible', async (e, flag, data) => {
      this.visible = flag;

      if (flag) {
        const { bookmark, title, url } = data;

        this.bookmark = bookmark;
        this.folders = await ipcRenderer.invoke('bookmarks-get-folders');

        if (!this.bookmark) {
          this.bookmark = await ipcRenderer.invoke('bookmarks-add', {
            title,
            url,
            parent: this.folders[0]._id,
          });
        }

        if (this.titleRef.current) {
          this.titleRef.current.value = title;
          this.titleRef.current.focus();
          this.titleRef.current.select();
        }
      }
    });

    window.addEventListener('blur', () => {
      if (this.visible) {
        setTimeout(() => {
          this.visible = false;
          this.hide();
        });
      }
    });

    ipcRenderer.send('get-settings');

    ipcRenderer.on('update-settings', (e, settings: ISettings) => {
      this.settings = { ...this.settings, ...settings };
    });
  }

  public hide() {
    ipcRenderer.send(`hide-${this.id}`);
  }
}

export default new Store();
