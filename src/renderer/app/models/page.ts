import { observable, computed } from 'mobx';
import store from '@app/store';

export class Page {
  @observable
  public id: number;

  @observable
  public url: string;

  public webContentsId: number;
  public webview: Electron.WebviewTag;

  constructor(id: number, url: string) {
    this.url = url;
    this.id = id;
  }

  @computed
  get isSelected() {
    return store.tabsStore.getCurrentGroup().selectedTab === this.id;
  }
}
