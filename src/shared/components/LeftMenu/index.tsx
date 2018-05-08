import React from 'react';
import { observer } from 'mobx-react';
import { Styled, Line, Title, Header, MenuIcon } from './styles';
import Item from './Item';

const menuIcon = require('../../icons/menu.svg');

interface Props {
  children?: any;
  title: string;
}

interface State {
  fullWidth: boolean;
}

@observer
export default class LeftMenu extends React.Component<Props, State> {
  public state: State = {
    fullWidth: true,
  };

  public static Item = Item;

  private onMenuClick = () => {
    this.setState({
      fullWidth: !this.state.fullWidth,
    });
  };

  public render() {
    const { children, title } = this.props;

    const { fullWidth } = this.state;

    return (
      <Styled fullWidth={fullWidth}>
        <Header>
          <MenuIcon image={menuIcon} onClick={this.onMenuClick} fullWidth={fullWidth} />
          <Title fullWidth={fullWidth}>{title}</Title>
        </Header>
        <Line />
        {React.Children.map(children, (child?: any) =>
          React.cloneElement(child, {
            fullWidth,
          }))}
      </Styled>
    );
  }
}
