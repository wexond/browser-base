import { computed, observable } from "mobx";
import os from "os";

// Interfaces
import {
  IAddressBar,
  IAddTabButton,
  IPage,
  ITab,
  ITabGroup
} from "./interfaces";

// Enums
import { Platforms } from "../shared/enums";

// Actions
import * as tabGroups from "./actions/tab-groups";
import * as tabs from "./actions/tabs";

class Store {
  @computed
  public get currentTabGroup(): ITabGroup {
    return tabGroups.getTabGroupById(this.selectedTabGroup);
  }

  @computed
  public get currentTab(): ITab {
    return this.currentTabGroup.getSelectedTab();
  }

  @observable public selectedTabGroup: number = 0;

  @observable
  public tabGroups: ITabGroup[] = [
    {
      selectedTab: -1,
      tabs: [] as ITab[],
      id: 0,
      lineLeft: 0,
      lineWidth: 0,
      getSelectedTab() {
        return tabs.getTabById(this.selectedTab);
      }
    }
  ];

  @observable public pages: IPage[] = [];

  @observable
  public addTabButton: IAddTabButton = {
    left: 0
  };

  @observable
  public addressBar: IAddressBar = {
    toggled: false,
    canToggle: false
  };

  public getTabBarWidth: () => number;
  public addTab: () => void;

  public platform: Platforms = os.platform() as Platforms;

  public mouse = {
    x: 0,
    y: 0
  };
}

export default new Store();
