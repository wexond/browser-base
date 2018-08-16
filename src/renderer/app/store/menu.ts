import { observable } from 'mobx';

export class MenuStore {
  @observable
  public visible = false;

  @observable
  public selectedItem: number;

  @observable
  public hideContent = false;

  @observable
  public searchText = '';

  public hide() {
    this.visible = false;
    this.selectedItem = null;
  }
}
