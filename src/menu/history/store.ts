import { observable } from 'mobx';
import Section from './models/section';
import Item from './components/Item';

class Store {
  @observable sections: Section[] = [];
}

export default new Store();
