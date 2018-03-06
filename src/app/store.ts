import { observable } from "mobx";

import { ITabGroup } from "./interfaces";

class Store {
  @observable public tabGroups: ITabGroup[] = [];
}

export default new Store();
