import { observer } from "mobx-react";
import React, { SFC } from "react";
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

import { IPage, ITab, ITabGroup } from "../../interfaces";

import Store from "../../store";

import * as tabs from "../../actions/tabs";
import Page from "../Page";

@observer
export default class App extends React.Component {
  private tabBar: HTMLDivElement;

  public addTab = () => {
    const tab = tabs.addTab();

    for (const item of Store.tabGroups[0].tabs) {
      this.setTabWidth(item);
    }

    tabs.setTabsPositions();
  }

  public setTabLeft = (tab: ITab) => {
    const left = tabs.getTabLeft(tab);
    tabs.setTabLeft(tab, left, false);
  }

  public setTabWidth = (tab: ITab) => {
    const { offsetWidth } = this.tabBar;

    const width = tabs.getTabWidth(tab, offsetWidth);
    tabs.setTabWidth(tab, width);
  }

  public renderTabGroups() {
    return Store.tabGroups.map((tabGroup: ITabGroup) => {
      return (
        <List key={tabGroup.id} inline>
          {tabGroup.tabs.map((tab: ITab) => {
            return (
              <Tab
                key={tab.id}
                tabGroupId={tabGroup.id}
                setLeft={(left: number, animation = true) => tabs.setTabLeft(tab, left, animation)}
                selected={tabGroup.selectedTab === tab.id}
                {...tab}
              />
            );
          })}
        </List>
      );
    });
  }

  public renderPages() {
    return Store.pages.map((page: IPage) => {
      return <Page key={page.id} {...page} selected={Store.tabGroups[0].selectedTab === page.id} />
    })
  }

  public render() {
    return (
      <List style={{ height: "100vh", overflow: 'hidden' }}>
        <SystemBar>
          <List innerRef={(r: any) => (this.tabBar = r)}>
            {this.renderTabGroups()}
          </List>

          <SystemBarButton
            icon={SystemBarIcons.Add}
            onClick={() => this.addTab()}
            style={{
              position: 'absolute',
              left: Store.addTabButtonLeft
            }}
          />

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

        <List>
          {this.renderPages()}
        </List>
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
