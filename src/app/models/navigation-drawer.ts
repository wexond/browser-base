import { observable } from 'mobx';

export default class NavigationDrawer {
  @observable public visible = false;
  @observable public selectedItem: string;
}
