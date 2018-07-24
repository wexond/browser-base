import * as React from 'react';
import Item from './Item';
import {
  Root, Name, Icon, List,
} from './styles';

export interface IProps {}

export interface IState {
  activated: boolean;
}

export default class Button extends React.Component<IProps, IState> {
  public static defaultProps = {};

  public static Item = Item;

  public state: IState = {
    activated: false,
  };

  public render() {
    const { activated } = this.state;

    return (
      <Root>
        <Name>Item 2</Name>
        <Icon activated={activated} />
        <List>
          <Item>Item 1</Item>
          <Item>Item 2</Item>
          <Item>Item 3</Item>
          <Item>Item 4</Item>
        </List>
      </Root>
    );
  }
}
