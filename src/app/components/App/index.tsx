import { observer } from "mobx-react";
import React from "react";

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
import Pages from "../Pages";
import TabBar from "../TabBar";
import ToolBar from "../ToolBar";
import ToolBarButton from "../ToolBarButton";
import ToolBarSeparator from "../ToolBarSeparator";
import WindowButton from "../WindowButton";

// Styles
import { Line, NavIcons, StyledApp } from "./styles";

import Store from "../../store";

export default observer(() => {
  return (
    <StyledApp>
      <ToolBar>
        <NavIcons>
          <ToolBarButton size={24} icon={Icons.Back} />
          <ToolBarButton size={24} icon={Icons.Forward} />
          <ToolBarButton size={20} icon={Icons.Refresh} />
        </NavIcons>
        <ToolBarSeparator />
        <TabBar />
        <ToolBarSeparator />
        <ToolBarButton size={16} icon={Icons.TabGroups} />
        <ToolBarButton size={18} icon={Icons.More} />
        {Store.platform !== Platforms.MacOS && (
          <>
            <ToolBarSeparator />
            <WindowButton icon={Icons.Minimize} onClick={minimizeWindow} />
            <WindowButton icon={Icons.Maximize} onClick={maximizeWindow} />
            <WindowButton icon={Icons.Close} onClick={closeWindow} />
          </>
        )}
        <Line />
      </ToolBar>
      <Pages />
    </StyledApp>
  );
});
