import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

// Components
import TabGroup from "../TabGroup";
import ToolBarButton from "../ToolBarButton";

// Styles
import { StyledTabBar, TabGroups } from "./styles";

// Enums
import { Icons } from "../../enums";

// Interfaces
import { ITabGroup } from "../../interfaces";

import Store from "../../store";

@observer
export default class TabBar extends React.Component<{}, {}> {
  private tabBar: HTMLDivElement;

  public componentDidMount() {
    Store.getTabBarWidth = this.getTabBarWidth;
  }

  public getTabBarWidth = () => this.tabBar.offsetWidth;

  public render() {
    return (
      <StyledTabBar innerRef={(r: any) => (this.tabBar = r)}>
        <TabGroups>
          {Store.tabGroups.map((tabGroup: ITabGroup) => {
            if (tabGroup.id !== Store.selectedTabGroup) {
              return null;
            }
            return <TabGroup key={tabGroup.id} tabGroup={tabGroup} />;
          })}
          <ToolBarButton
            icon={Icons.AddTab}
            onClick={Store.addTab}
            style={{
              position: "absolute",
              right: 0,
              left: Store.addTabButton.left,
              top: 0
            }}
          />
        </TabGroups>
      </StyledTabBar>
    );
  }
}
