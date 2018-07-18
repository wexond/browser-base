import { observable } from 'mobx';

class Store {
  @observable public data: any = {};

  @observable public selected: any = null;
}

export default new Store();
