import { observable } from 'mobx';

export class PagesStore {
  @observable
  public pages: Page[] = [];
}
