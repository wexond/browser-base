import { observable } from 'mobx';
import pages from './defaults/pages';

class Store {
  @observable toolbarHeight = pages.toolbarHeight;
  @observable toolbarSmallFontSize = false;
}

export default new Store();
