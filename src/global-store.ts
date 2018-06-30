import { observable } from 'mobx';

const englishDictionary = require('../static/dictionaries/english.json');

class GlobalStore {
  // Observables
  @observable public dictionary: any = englishDictionary;
}

export default new GlobalStore();
