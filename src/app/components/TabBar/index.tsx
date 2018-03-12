import { observer } from "mobx-react";
import React from "react";

// Components
import styled from "styled-components";
import SystemBarButton from "../SystemBarButton";
import TabGroup from "../TabGroup";

// Enums
import { Platforms } from "../../../shared/enums";
import { SystemBarIcons } from "../../enums";

// Interfaces
import { ITabGroup } from "../../interfaces";

import Store from "../../store";

@observer
export default class TabBar extends React.Component<{}, {}> {
  public state = {
    scrollbarThumbWidth: 0,
    scrollbarWidth: 0,
    scrollLeft: 0,
    scrollbarVisible: false
  };

  private tabBar: HTMLDivElement;

  public componentDidMount() {
    Store.getTabBarWidth = this.getTabBarWidth;
  }

  public getTabBarWidth = () => this.tabBar.offsetWidth;

  public render() {
    return (
      <StyledTabBar innerRef={(r: any) => (this.tabBar = r)}>
        {Store.tabGroups.map((tabGroup: ITabGroup) => {
          if (tabGroup.id !== Store.selectedTabGroup) {
            return null;
          }
          return <TabGroup key={tabGroup.id} tabGroup={tabGroup} />;
        })}
        <SystemBarButton
          icon={SystemBarIcons.Add}
          onClick={() => Store.addTab()}
          style={{
            position: "absolute",
            left: Store.addTabButton.left,
            right: 0,
            top: 0
          }}
        />
      </StyledTabBar>
    );
  }
}

const StyledTabBar = styled.div`
  margin-left: ${Store.platform === Platforms.MacOS ? 78 : 0}px;
  flex: 1;
  position: relative;
`;
