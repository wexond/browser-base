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

export default () => {
  return (
    <List style={{ height: "100vh" }}>
      <SystemBar>
        <List innerRef={(r: any) => (this.tabBar = r)} />

        <SystemBarButton icon={SystemBarIcons.Add} />

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
};

const Line = styled.div`
  background-color: rgba(0, 0, 0, 0.12);
  height: 1px;
  width: 100%;
  position: absolute;
  z-index: 1;
  bottom: 0;
`;
