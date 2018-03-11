import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import images from "../../../shared/mixins/images";

import * as tabs from "../../actions/tabs";

import { ITab, ITabGroup, ITransition } from "../../interfaces";

import Store from "../../store";

import { transitionsToString } from "../../utils/transitions";

import anime from "animejs";
import { TAB_MAX_WIDTH } from "../../constants/design";
import { tabTransitions } from "../../defaults/tabs";

interface IProps {
  key: number;
  tab: ITab;
  tabGroup: ITabGroup;
  selected: boolean;
}

export default observer(({ selected, tab, tabGroup }: IProps) => {
  const { left, width, title, id, isRemoving } = tab;

  const close = () => {
    if (tabGroup.tabs.indexOf(tab) === tabGroup.tabs.length - 1) {
      tabGroup.selectedTab = tabGroup.tabs[tabGroup.tabs.indexOf(tab) - 1].id;
    } else {
      tabGroup.selectedTab = tabGroup.tabs[tabGroup.tabs.indexOf(tab) + 1].id;
    }

    if (tabs.getScrollingMode(tabGroup) || tab.width === TAB_MAX_WIDTH) {
      tab.isRemoving = true;
      setTimeout(() => {
        anime({
          targets: tab,
          width: 0,
          round: 1,
          easing: 'easeOutCubic',
          duration: 300
        });

        tabs.setTabsWidths();
        tabs.setTabsPositions();

        setTimeout(() => {
          tabs.removeTab(tab);
        }, tabTransitions.left.duration * 1000);
      }, 50);
    } else {
      tabs.removeTab(tab);
      tabs.setTabsWidths();
      tabs.setTabsPositions();
    }
  };

  const select = () => {
    tabs.selectTab(tab);
  };

  return (
    <StyledTab
      selected={selected}
      style={{ left, width }}
      onMouseDown={select}
      isRemoving={isRemoving}
    >
      <Title isRemoving={isRemoving}>{title}</Title>
      <Close isRemoving={isRemoving} selected={selected} onClick={close} />
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
  height: 100%;
  left: 0;
  top: 0;
  overflow: hidden;

  background-color: ${(props: IStyledTabProps) => {
    if (props.isRemoving) {
      return "#fff";
    } else {
      if (props.selected) {
        return "#fff";
      } else {
        return "none";
      }
    }
  }};
  z-index: ${props => (props.selected ? 2 : 1)};
`;

interface ITitleProps {
  isRemoving: boolean;
}

const Title = styled.div`
  position: absolute;
  left: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  white-space: nowrap;
  opacity: ${(props: ITitleProps) => (props.isRemoving ? 0 : 1)};
  transition: 0.2s opacity;
`;

interface ICloseProps {
  isRemoving: boolean;
  selected: boolean;
}

const Close = styled.div`
  position: absolute;
  right: 8px;
  height: 16px;
  width: 16px;
  background-image: url(../../src/app/icons/actions/close.svg);
  ${images.center("100%", "100%")};
  opacity: ${(props: ICloseProps) => (props.isRemoving ? 0 : 1)};
  transition: 0.2s opacity;
  display: ${props => props.selected ? "block" : "none"};
`;
