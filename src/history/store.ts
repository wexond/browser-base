import { observable } from 'mobx';
import Section from './models/section';

class Store {
  @observable sections: Section[] = [];
  @observable toolbarHeight = 128;
}

export default new Store();
