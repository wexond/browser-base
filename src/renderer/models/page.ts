import { observable } from 'mobx';

export default class Page {
  @observable
  public id: number = -1;

  @observable
  public url: string;

  public webview: Electron.WebviewTag;

  constructor(id: number, url: string) {
    this.id = id;
    this.url = url;
  }
}
