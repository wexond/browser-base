import { observable } from 'mobx';

const englishDictionary = require('../static/dictionaries/english-en.json');

class GlobalStore {
  // Observables
  @observable public dictionary: any = englishDictionary;
}

export default new GlobalStore();
