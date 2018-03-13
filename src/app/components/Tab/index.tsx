import { observer } from "mobx-react";
import { transparency } from "nersent-ui";
import React from "react";
import styled from "styled-components";

import images from "../../../shared/mixins/images";

import * as tabs from "../../actions/tabs";

import { ITab, ITabGroup } from "../../interfaces";

import Store from "../../store";

import { TAB_MAX_WIDTH } from "../../constants/design";
import { tabAnimations } from "../../defaults/tabs";

import { closeWindow } from "../../utils/window";

interface IProps {
  key: number;
  tab: ITab;
  tabGroup: ITabGroup;
  selected: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
}

export default observer(({ selected, tab, tabGroup, onMouseDown, onMouseUp }: IProps) => {
  const { left, width, title, id, isRemoving } = tab;

  const close = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const tabIndex = tabGroup.tabs.indexOf(tab);

    if (tabIndex + 1 < tabGroup.tabs.length && !tabGroup.tabs[tabIndex + 1].isRemoving) {
      tabGroup.selectedTab = tabGroup.tabs[tabIndex + 1].id;
    } else if (tabIndex - 1 >= 0 && !tabGroup.tabs[tabIndex - 1].isRemoving) {
      tabGroup.selectedTab = tabGroup.tabs[tabIndex - 1].id;
    } else {
      if (Store.tabGroups.length === 1) {
        closeWindow();
      }
    }

    if (tabs.getScrollingMode(tabGroup) || tab.width === TAB_MAX_WIDTH) {
      tab.isRemoving = true;
      tabs.animateTab(tab, "width", 0);

      tabs.setTabsWidths();
      tabs.setTabsPositions();

      setTimeout(() => {
        tabs.removeTab(tab);
      }, tabAnimations.left.duration * 1000);
    } else {
      tabs.removeTab(tab);
      tabs.setTabsWidths();
      tabs.setTabsPositions();
    }
  };

  return (
    <StyledTab
      selected={selected}
      style={{ left, width }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      isRemoving={isRemoving}
    >
      <Title>{title}</Title>
      <Close selected={selected} onClick={close} />
    </StyledTab>
  );
});

interface IStyledTabProps {
  selected: boolean;
  isRemoving: boolean;
}

const StyledTab = styled.div`
  -webkit-app-region: no-drag;
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  height: calc(100% - 2px);
  z-index: ${(props: IStyledTabProps) => (props.selected ? 2 : 1)};
  pointer-events: ${props => props.isRemoving ? "none" : "auto"};
`;

const Title = styled.div`
  position: absolute;
  left: calc(50%);
  transform: translateX(-50%);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: 0.2s opacity;
  font-weight: 500;
  text-transform: uppercase;
  max-width: calc(100% - 64px);
  opacity: ${transparency.light.text.primary};
`;

interface ICloseProps {
  selected: boolean;
}

const Close = styled.div`
  position: absolute;
  right: 12px;
  height: 16px;
  width: 16px;
  background-image: url(../../src/app/icons/actions/close.svg);
  ${images.center("100%", "100%")};
  transition: 0.2s opacity;
  display: ${(props: ICloseProps) => props.selected ? "block" : "none"};
  opacity: ${transparency.light.icons.inactive};
`;