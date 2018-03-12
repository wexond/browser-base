import { observer } from "mobx-react";
import React from "react";

// Components
import styled from "styled-components";
import SystemBarButton from "../SystemBarButton";
import TabGroup from "../TabGroup";

// Enums
import { Platforms } from "../../../shared/enums";
import { Icons } from "../../enums";

// Interfaces
import { ITabGroup } from "../../interfaces";

// Mixins
import { shadows } from "nersent-ui";

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
        <TabGroups>
          {Store.tabGroups.map((tabGroup: ITabGroup) => {
            if (tabGroup.id !== Store.selectedTabGroup) {
              return null;
            }
            return <TabGroup key={tabGroup.id} tabGroup={tabGroup} />;
          })}
          <SystemBarButton
            icon={Icons.Add}
            onClick={() => Store.addTab()}
            style={{
              position: "absolute",
              right: 0,
              left: Store.addTabButton.left,
              top: 0
            }}
          />
        </TabGroups>
        <SystemBarButton size={16} icon={Icons.TabGroups} />
      </StyledTabBar>
    );
  }
}

const TabGroups = styled.div`
  display: flex;
  flex: 1;
  position: relative;
`

const StyledTabBar = styled.div`
  position: relative;
  z-index: 8;
  height: 100%;
  display: flex;
  flex: 1;
  margin-left: 16px;
`;
