import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import images from "../../../shared/mixins/images";

import * as tabs from "../../actions/tabs";

import { ITab, ITabGroup, ITransition } from "../../interfaces";

import Store from "../../store";

import { transitionsToString } from "../../utils/transitions";

interface IProps {
  key: number;
  tab: ITab;
  tabGroup: ITabGroup;
  selected: boolean;
}

@observer
export default class Tab extends React.Component<IProps, {}> {
  public tabElement: HTMLDivElement;

  public close = () => {
    const { tab } = this.props;

    tabs.removeTab(tab);

    const containerWidth = Store.getTabBarWidth();

    tabs.setTabsWidths(containerWidth);
    tabs.setTabsPositions();
  };

  public select = () => {
    tabs.selectTab(this.props.tab);
  };

  public render() {
    const { selected, tab } = this.props;
    const { transitions, left, width, title } = tab;

    return (
      <StyledTab
        selected={selected}
        style={{ left, width, transition: transitionsToString(transitions) }}
        onMouseDown={this.select}
        innerRef={r => (this.tabElement = r)}
      >
        <Content>
          <Title>{title}</Title>
          <Close onClick={this.close} />
        </Content>
      </StyledTab>
    );
  }
}

interface IStyledTabProps {
  selected: boolean;
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

  background-color: ${(props: IStyledTabProps) =>
    props.selected ? "#fff" : "none"};
  z-index: ${props => (props.selected ? 2 : 1)};
`;

const Content = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  position: absolute;
  left: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  white-space: nowrap;
`;

const Close = styled.div`
  position: absolute;
  right: 8px;
  height: 16px;
  width: 16px;
  background-image: url(../../src/app/icons/actions/close.svg);
  ${images.center("100%", "100%")};
`;
