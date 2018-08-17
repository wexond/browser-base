import { observable } from 'mobx';

export class Page {
  @observable
  public id: number;

  @observable
  public url: string;

  public webview: Electron.WebviewTag;

  constructor(id: number, url: string) {
    this.url = url;
    this.id = id;
  }
}
