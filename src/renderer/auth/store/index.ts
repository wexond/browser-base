import { observable } from 'mobx';

export class Store {
  @observable
  public url: string;

  constructor() {}
}

export default new Store();
