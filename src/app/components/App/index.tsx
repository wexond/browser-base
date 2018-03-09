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
import Pages from "../Pages";
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

export default () => {
  return (
    <List style={{ height: "100vh", overflow: "hidden" }}>
      <SystemBar>
        <TabBar />

        <SystemBarButton size={16} icon={SystemBarIcons.TabGroups} />

        <SystemBarButton
          windows={true}
          icon={SystemBarIcons.Minimize}
          onClick={minimizeWindow}
        />
        <SystemBarButton
          windows={true}
          icon={SystemBarIcons.Maximize}
          onClick={maximizeWindow}
        />
        <SystemBarButton
          windows={true}
          icon={SystemBarIcons.Close}
          onClick={closeWindow}
        />
        <Line />
      </SystemBar>

      <Pages />
    </List>
  );
};

const Line = styled.div`
  background-color: rgba(0, 0, 0, 0.12);
  height: 1px;
  width: 100%;
  position: absolute;
  z-index: 1;
  bottom: 0;
`;
