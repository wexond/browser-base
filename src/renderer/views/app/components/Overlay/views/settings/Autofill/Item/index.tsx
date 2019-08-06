import * as React from 'react';

import {  StyledItem, Header, Label, DropIcon, Icon } from './styles';

interface Props {
  label: string;
  icon: any;
}

interface State {
  expanded: boolean;
}

export class Item extends React.PureComponent<Props, State> {
  public state: State = {
    expanded: false,
  }

  render() {
    const {  label, icon } = this.props;
    const { expanded } = this.state;

    return (
      <StyledItem>
        <Header>
          <Icon icon={icon} />
          <Label>{label}</Label>
          <DropIcon />
        </Header>
      </StyledItem>
    );
  }
};
