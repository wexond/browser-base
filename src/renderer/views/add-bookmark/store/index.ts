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

  public constructor() {
    ipcRenderer.on('visible', (e, flag, data) => {
      this.visible = flag;

      if (flag) {
        const { bookmark, title } = data;
        this.bookmark = bookmark;
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
