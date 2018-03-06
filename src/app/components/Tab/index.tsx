import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import images from "../../../shared/mixins/images";

interface IProps {
  title: string;
  tabGroupId: number;
  selected: boolean;
}

@observer
export default class Tab extends React.Component<IProps, {}> {
  public render() {
    const { title, selected } = this.props;

    return (
      <StyledTab selected={selected}>
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

  background-color: ${(props: IStyledTabProps) => props.selected ? "#fff" : "none"};
  z-index: ${(props: IStyledTabProps) => props.selected ? 2 : 1};
`;

const Content = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  margin-left: 8px;
  margin-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const Close = styled.div`
  height: 16px;
  width: 16px;
  margin-right: 8px;
  background-image: url(../../src/app/icons/actions/close.svg);
  ${images.center("100%", "100%")}
`