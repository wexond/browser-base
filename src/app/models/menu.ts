import { observable } from 'mobx';

import { MenuItems } from '../enums';

export default class Menu {
  @observable public visible = false;

  @observable public selectedItem: MenuItems;

  @observable public hideContent = false;
}
