import * as React from 'react';

import {  StyledItem, Header, Label, DropIcon, Icon, Container } from './styles';

interface Props {
  label: string;
  icon: any;
  children?: any;
  style?: any;
}

interface State {
  expanded: boolean;
}

export class Item extends React.PureComponent<Props, State> {
  public state: State = {
    expanded: true,
  }

  private onClick = () => {
    this.setState({ expanded: true });
  }

  render() {
    const { label, icon, children, style } = this.props;
    const { expanded } = this.state;

    return (
      <StyledItem style={style}>
        <Header onClick={this.onClick}>
          <Icon icon={icon} />
          <Label>{label}</Label>
          <DropIcon />
        </Header>
        <Container expanded={expanded}>
          {children}
        </Container>
      </StyledItem>
    );
  }
};
