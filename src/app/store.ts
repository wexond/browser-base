import { observable } from "mobx";
import os from "os";

import { IAddTabButton, IPage, ITab, ITabGroup } from "./interfaces";

import { Platforms } from "../shared/enums";

class Store {
  public selectedTabGroup: number = 0;
  @observable
  public tabGroups: ITabGroup[] = [
    {
      selectedTab: -1,
      tabs: [] as ITab[],
      id: 0,
      scrollingMode: false,
      containerWidth: 0
    }
  ];

  @observable public pages: IPage[] = [];

  @observable
  public addTabButton: IAddTabButton = {
    left: 0
  };

  public getTabBarWidth: () => number;
  public addTab: () => void;

  public platform: Platforms = os.platform() as Platforms;
}

export default new Store();
