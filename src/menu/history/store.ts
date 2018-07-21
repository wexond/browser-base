import { observable } from 'mobx';
import Section from './models/section';

class Store {
  @observable sections: Section[] = [];

  @observable selectedItems: number[] = [];

  itemsLimit = 20;
}

export default new Store();
