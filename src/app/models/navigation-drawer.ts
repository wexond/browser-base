import { observable } from 'mobx';

import { NavigationDrawerItems } from '../enums';

export default class NavigationDrawer {
  @observable public visible = false;
  @observable public selectedItem: NavigationDrawerItems;
}
