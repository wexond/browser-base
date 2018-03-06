import { observable } from "mobx";

import { ITab, ITabGroup } from "./interfaces";

class Store {
  @observable
  public tabGroups: ITabGroup[] = [
    {
      selectedTab: -1,
      tabs: [] as ITab[],
      id: 0
    }
  ];
}

export default new Store();
