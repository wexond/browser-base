import { observable } from "mobx";
import os from "os";

import { IPage, ITab, ITabGroup } from "./interfaces";

import { Platforms } from "../shared/enums";

class Store {
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
  public addTabButton: {
    left: number | "auto";
    leftAnimation: boolean;
  } = {
    left: 0,
    leftAnimation: true
  };

  public getTabBarWidth: () => number;
  public platform: Platforms = os.platform() as Platforms;
}

export default new Store();
