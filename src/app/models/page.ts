import { observable } from 'mobx';

export default class Page {
  @observable public id: number = -1;
  @observable public url: string = 'wexond://newtab';

  public webview: Electron.WebviewTag;

  constructor(id: number) {
    this.id = id;
  }
}
