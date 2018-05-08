import React from 'react';
import { observer } from 'mobx-react';
import { Styled, Line, Title, Header, MenuIcon } from './styles';
import Item from './Item';

const menuIcon = require('../../icons/menu.svg');

interface Props {
  children?: any;
  title: string;
}

@observer
export default class LeftMenu extends React.Component<Props, {}> {
  public static Item = Item;

  public render() {
    const { children, title } = this.props;

    return (
      <Styled>
        <Header>
          <MenuIcon image={menuIcon} />
          <Title>{title}</Title>
        </Header>
        <Line />
        {children}
      </Styled>
    );
  }
}
