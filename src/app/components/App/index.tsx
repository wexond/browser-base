import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { SystemBarIcons } from "../../enums";

import {
  closeWindow,
  maximizeWindow,
  minimizeWindow
} from "../../utils/window";

import List from "../List";
import SystemBar from "../SystemBar";
import SystemBarButton from "../SystemBarButton";
import Tab from "../Tab";

import { ITab, ITabGroup } from "../../interfaces";

import Store from "../../store";

import * as tabs from "../../actions/tabs";

@observer
export default class App extends React.Component {
  private tabBar: HTMLDivElement;

  public onAddTabClick = () => {
    tabs.addTab();
  }

  public renderTabGroups() {
    return Store.tabGroups.map((tabGroup: ITabGroup) => {
      return (
        <List key={tabGroup.id} inline>
          {tabGroup.tabs.map((tab: ITab) => {
            return <Tab key={tab.id} tabGroupId={tabGroup.id} selected={tabGroup.selectedTab === tab.id} {...tab} />;
          })}
        </List>
      );
    });
  }

  public render() {
    return (
      <List style={{ height: "100vh" }}>
        <SystemBar>
          <List innerRef={(r: any) => (this.tabBar = r)}>
            {this.renderTabGroups()}
          </List>

          <SystemBarButton icon={SystemBarIcons.Add} onClick={this.onAddTabClick} />

          <SystemBarButton size={16} icon={SystemBarIcons.TabGroups} />

          <SystemBarButton
            windows
            icon={SystemBarIcons.Minimize}
            onClick={() => minimizeWindow()}
          />
          <SystemBarButton
            windows
            icon={SystemBarIcons.Maximize}
            onClick={() => maximizeWindow()}
          />
          <SystemBarButton
            windows
            icon={SystemBarIcons.Close}
            onClick={() => closeWindow()}
          />
          <Line />
        </SystemBar>

        <List />
      </List>
    );
  }
}

const Line = styled.div`
  background-color: rgba(0, 0, 0, 0.12);
  height: 1px;
  width: 100%;
  position: absolute;
  z-index: 1;
  bottom: 0;
`;
