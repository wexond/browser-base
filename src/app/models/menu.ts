import { observable } from 'mobx';

export default class Menu {
  @observable public visible = false;

  @observable public selectedItem: number;

  @observable public hideContent = false;
}
