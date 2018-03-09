import React from "react";
import styled from "styled-components";

// Enums
import { SystemBarIcons } from "../../enums";

// Utils
import {
  closeWindow,
  maximizeWindow,
  minimizeWindow
} from "../../utils/window";

// Components
import List from "../List";
import Page from "../Page";
import SystemBar from "../SystemBar";
import SystemBarButton from "../SystemBarButton";
import TabBar from "../TabBar";
import TabGroup from "../TabGroup";

// Interfaces
import { IPage, ITab, ITabGroup } from "../../interfaces";

import Store from "../../store";

// Actions
import * as tabs from "../../actions/tabs";

// Defaults and constants
import { HOVER_DURATION } from "../../constants/design";
import { tabTransitions } from "../../defaults/tabs";

export default class App extends React.Component {
  public renderPages() {
    return Store.pages.map((page: IPage) => {
      return (
        <Page
          key={page.id}
          {...page}
          selected={Store.tabGroups[0].selectedTab === page.id}
        />
      );
    });
  }

  public render() {
    return (
      <List style={{ height: "100vh", overflow: "hidden" }}>
        <SystemBar>
          <TabBar />

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

        <List>{this.renderPages()}</List>
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
