import { observable } from 'mobx';

const dictionary = require('../static/dictionaries/english-en.json');

class GlobalStore {
  // Observables
  @observable public dictionary: any = dictionary;
}

export default new GlobalStore();
