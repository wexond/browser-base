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

export default () => {
  return (
    <List style={{ height: "100vh", overflow: "hidden" }}>
      <SystemBar>
        <Bar>
          <Icon icon={Icons.Back} size={24} />
          <Icon icon={Icons.Forward} size={24} />
          <Icon icon={Icons.Refresh} size={20} />
          <Input />
        </Bar>
        {Store.platform !== Platforms.MacOS && (
          <>
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
      </SystemBar>
      <TabBar />
      <Pages />
    </List>
  );
};

const Bar = styled.div`
  flex: 1;
  display: flex;
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
`

interface IIconProps {
  icon: Icons;
  size: number;
}

const Icon = styled.div`
  background-image: url(${(props: IIconProps) => "../../src/app/icons/" + props.icon});
  ${props => images.center(`${props.size}px`, `${props.size}px`)};
  height: 100%;
  min-width: 48px;
  opacity: ${transparency.light.icons.inactive};

  &:hover {
    opacity: ${transparency.light.icons.active};
  }
`
