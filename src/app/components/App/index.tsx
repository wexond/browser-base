import { observer } from "mobx-react";
import { transparency } from "nersent-ui";
import React from "react";
import styled from "styled-components";

// Enums
import { Platforms } from "../../../shared/enums";
import { Icons } from "../../enums";

// Utils
import {
  closeWindow,
  maximizeWindow,
  minimizeWindow
} from "../../utils/window";

// Components
import List from "../List";
import Pages from "../Pages";
import Separator from "../Separator";
import SystemBar from "../SystemBar";
import SystemBarButton from "../SystemBarButton";
import TabBar from "../TabBar";

// Interfaces
import { IPage, ITab, ITabGroup } from "../../interfaces";

import Store from "../../store";

// Actions
import * as tabs from "../../actions/tabs";

// Defaults and constants
import images from "../../../shared/mixins/images";
import { HOVER_DURATION } from "../../constants/design";

export default observer(() => {
  return (
    <List style={{ height: "100vh", overflow: "hidden" }}>
      <SystemBar>
        <NavIcons>
          <SystemBarButton size={24} icon={Icons.Back} />
          <SystemBarButton size={24} icon={Icons.Forward} />
          <SystemBarButton size={20} icon={Icons.Refresh} />
        </NavIcons>
        <Separator />
        <TabBar />
        <Separator />
        <SystemBarButton size={16} icon={Icons.TabGroups} />
        <SystemBarButton size={18} icon={Icons.More} />
        {Store.platform !== Platforms.MacOS && (
          <>
            <Separator />
            <SystemBarButton
              windows={true}
              icon={Icons.Minimize}
              onClick={minimizeWindow}
            />
            <SystemBarButton
              windows={true}
              icon={Icons.Maximize}
              onClick={maximizeWindow}
            />
            <SystemBarButton
              windows={true}
              icon={Icons.Close}
              onClick={closeWindow}
            />
          </>
        )}
        <Line />
      </SystemBar>
      <Pages />
    </List>
  );
});

const NavIcons = styled.div`
  display: flex;
  -webkit-app-region: no-drag;
`;

const Line = styled.div`
  background-color: rgba(0, 0, 0, 0.12);
  height: 1px;
  width: 100%;
  position: absolute;
  z-index: 1;
  bottom: 0;
`;

const Input = styled.div`
  background-color: black;
  opacity: 0.12;
  height: 32px;
  top: 50%;
  position: relative;
  transform: translateY(-50%);
  width: 100%;
  border-radius: 2px;
  margin-left: 48px;
  margin-right: 48px;
`;

interface INavIconProps {
  icon: Icons;
  size: number;
}

const NavIcon = styled.div`
  background-image: url(${(props: INavIconProps) =>
    "../../src/app/icons/" + props.icon});
  ${props => images.center(`${props.size}px`, `${props.size}px`)};
  height: 100%;
  min-width: 48px;
  opacity: ${transparency.light.icons.inactive};

  &:hover {
    opacity: ${transparency.light.icons.active};
  }
`;
