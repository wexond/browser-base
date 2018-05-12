import { observable } from 'mobx';
import Section from '../history/models/section';

class Store {
  @observable sections: Section[] = [];
}

export default new Store();
