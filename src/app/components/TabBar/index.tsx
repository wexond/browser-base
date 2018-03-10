import { observer } from "mobx-react";
import React from "react";

// Components
import List from "../List";
import SystemBarButton from "../SystemBarButton";
import TabGroup from "../TabGroup";

// Constants and defaults
import { HOVER_DURATION, SYSTEM_BAR_HEIGHT, TAB_MIN_WIDTH } from "../../constants/design";
import { tabTransitions } from "../../defaults/tabs";

// Enums
import { SystemBarIcons } from "../../enums";

// Actions
import * as tabs from "../../actions/tabs";

// Interfaces
import { ITab, ITabGroup } from "../../interfaces";

import Store from "../../store";

import styled from "styled-components";
import { Platforms } from "../../../shared/enums";

@observer
export default class TabBar extends React.Component<{}, {}> {
  private tabBar: HTMLDivElement;

  public componentDidMount() {
    Store.getTabBarWidth = this.getTabBarWidth;

    window.addEventListener("resize", e => {
      if (!e.isTrusted) {
        return;
      }

      if (!tabs.getScrollingMode(Store.tabGroups[0])) {
        tabs.setTabsWidths(false);
        tabs.setTabsPositions(false, false);
      }
    });
  }

  public addTab = () => {
    const tab = tabs.addTab();
    const containerWidth = this.getTabBarWidth();

    const width = tabs.getTabWidth(tab);
    tabs.setTabAnimation(tab, "left", false);
    tabs.setTabAnimation(tab, "width", true);

    tab.left = tabs.getTabLeft(tab);

    requestAnimationFrame(() => {
      tabs.setTabsWidths();
      tabs.setTabsPositions();
    });
  };

  public getTabBarWidth = () => this.tabBar.offsetWidth;

  public render() {
    const addTabButtonStyle: React.CSSProperties = {
      position: "absolute",
      left: Store.addTabButton.left,
      right: 0,
      transition: `${HOVER_DURATION}s opacity ${
        Store.addTabButton.leftAnimation
          ? `, ${tabTransitions.left.duration}s ${tabTransitions.left.easing}`
          : ""
      }`,
      top: 0
    };

    return (
      <StyledTabBar innerRef={(r: any) => (this.tabBar = r)}>
        <TabGroups>
          {Store.tabGroups.map((tabGroup: ITabGroup) => {
            return <TabGroup key={tabGroup.id} tabGroup={tabGroup} />;
          })}
        </TabGroups>
        <SystemBarButton
          icon={SystemBarIcons.Add}
          onClick={this.addTab}
          style={addTabButtonStyle}
        />
      </StyledTabBar>
    );
  }
}

const StyledTabBar = styled.div`
  margin-left: ${(Store.platform === Platforms.MacOS ? 78 : 0)}px;
  flex: 1;
  position: relative;
`;

const TabGroups = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
  width: calc(100% - ${SYSTEM_BAR_HEIGHT}px);
`;