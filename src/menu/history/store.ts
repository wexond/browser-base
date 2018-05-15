import { observable } from 'mobx';
import Section from './models/section';

class Store {
  @observable sections: Section[] = [];
}

export default new Store();
