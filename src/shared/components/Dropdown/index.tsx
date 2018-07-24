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

  public onClick = () => {
    this.setState({
      activated: true,
    });

    requestAnimationFrame(() => {
      window.addEventListener('click', this.onWindowClick);
    });
  };

  public onWindowClick = () => {
    this.setState({
      activated: false,
    });

    window.removeEventListener('click', this.onWindowClick);
  };

  public onListClick = (e: React.SyntheticEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  public render() {
    const { activated } = this.state;

    return (
      <Root onClick={this.onClick}>
        <Name>Item 2</Name>
        <Icon activated={activated} />
        <List onClick={this.onListClick} activated={activated}>
          <Item>Item 1</Item>
          <Item>Item 2</Item>
          <Item>Item 3</Item>
          <Item>Item 4</Item>
        </List>
      </Root>
    );
  }
}
