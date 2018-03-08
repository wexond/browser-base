import { observable } from "mobx";

import { IPage, ITab, ITabGroup } from "./interfaces";

class Store {
  @observable
  public tabGroups: ITabGroup[] = [
    {
      selectedTab: -1,
      tabs: [] as ITab[],
      id: 0
    }
  ];

  @observable public pages: IPage[] = [];

  @observable public addTabButtonLeft = 0;
}

export default new Store();
