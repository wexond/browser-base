import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import images from "../../../shared/mixins/images";

interface IProps {
  title: string;
  tabGroupId: number;
  selected: boolean;
  left: number;
  width: number;
  setLeft: (left: number, animation?: boolean) => void;
}

@observer
export default class Tab extends React.Component<IProps, {}> {
  public render() {
    const { title, selected, width, left } = this.props;

    return (
      <StyledTab selected={selected} style={{left, width}}>
        <Content>
          <Title>{title}</Title>
          <Close />
        </Content>
      </StyledTab>
    );
  }
}

interface IStyledTabProps {
  selected: boolean;
}

const StyledTab = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  height: 100%;
  left: 0;
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
