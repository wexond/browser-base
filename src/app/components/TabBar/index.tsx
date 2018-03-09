import { observer } from "mobx-react";
import React from "react";

// Components
import List from "../List";
import SystemBarButton from "../SystemBarButton";
import TabGroup from "../TabGroup";

// Constants and defaults
import { HOVER_DURATION } from "../../constants/design";
import { tabTransitions } from "../../defaults/tabs";

// Enums
import { SystemBarIcons } from "../../enums";

// Actions
import * as tabs from "../../actions/tabs";

// Interfaces
import { ITabGroup } from "../../interfaces";

import Store from "../../store";

@observer
export default class TabBar extends React.Component<{}, {}> {
  private tabBar: HTMLDivElement;

  public componentDidMount() {
    Store.getTabBarWidth = this.getTabBarWidth;

    window.addEventListener("resize", e => {
      if (!e.isTrusted) {
        return;
      }

      tabs.setTabsWidths(this.getTabBarWidth(), false);
      tabs.setTabsPositions(false, false);
    });
  }

  public addTab = () => {
    const tab = tabs.addTab();
    const containerWidth = this.getTabBarWidth();

    const width = tabs.getTabWidth(tab, containerWidth);
    tabs.setTabAnimation(tab, "left", false);
    tabs.setTabAnimation(tab, "width", true);

    tab.left = tabs.getTabLeft(tab);

    requestAnimationFrame(() => {
      tabs.setTabsWidths(containerWidth);
      tabs.setTabsPositions();
    });
  };

  public getTabBarWidth = () => this.tabBar.offsetWidth;

  public render() {
    const addTabButtonStyle = {
      position: "absolute",
      left: Store.addTabButton.left,
      transition: `${HOVER_DURATION}s opacity ${
        Store.addTabButton.leftAnimation
          ? `, ${tabTransitions.left.duration}s ${
              tabTransitions.left.easing
            }`
          : ""
      }`
    }

    return (
      <List innerRef={(r: any) => (this.tabBar = r)}>
        {Store.tabGroups.map((tabGroup: ITabGroup) => {
          return <TabGroup key={tabGroup.id} tabGroup={tabGroup} />;
        })}

        <SystemBarButton
          icon={SystemBarIcons.Add}
          onClick={this.addTab}
          style={addTabButtonStyle}
        />
      </List>
    );
  }
}
