import { observable } from 'mobx';

export class MenuStore {
  @observable
  public visible = false;
}
