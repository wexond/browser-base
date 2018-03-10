import DevTools from "mobx-react-devtools";
import React from "react";
import styled from "styled-components";

// Enums
import { Platforms } from "../../../shared/enums";
import { SystemBarIcons } from "../../enums";

// Utils
import {
  closeWindow,
  maximizeWindow,
  minimizeWindow
} from "../../utils/window";

// Components
import List from "../List";
import Pages from "../Pages";
import SystemBar from "../SystemBar";
import SystemBarButton from "../SystemBarButton";
import TabBar from "../TabBar";

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

        <SystemBarButton
          size={16}
          icon={SystemBarIcons.TabGroups}
          style={{ position: "relative", right: 0, zIndex: 3 }}
        />
        {Store.platform !== Platforms.MacOS && (
          <>
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
          </>
        )}
        <Line />
      </SystemBar>

      <Pages />

      {process.env.NODE_ENV === "development" && (
        <DevTools position={{ bottom: 0, right: 0 }} />
      )}
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
