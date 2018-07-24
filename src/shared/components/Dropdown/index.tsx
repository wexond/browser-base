import * as React from 'react';
import { getEvents } from '../../utils/events';
import { getRippleEvents } from '../../utils/ripple';
import Ripples from '../Ripples';
import Item from './Item';
import colors from '../../defaults/colors';
import {
  Root, Name, Icon, List,
} from './styles';

export interface IProps {
  ripple?: boolean;
  customRippleBehavior?: boolean;
}

export interface IState {
  activated: boolean;
}

export default class Button extends React.Component<IProps, IState> {
  public static defaultProps = {
    customRippleBehavior: false,
    ripple: true,
  };

  public static Item = Item;

  public state: IState = {
    activated: false,
  };

  private ripples: Ripples;

  public onClick = () => {
    const { activated } = this.state;

    this.setState({
      activated: !activated,
    });
  };

  public render() {
    const { ripple, customRippleBehavior } = this.props;
    const { activated } = this.state;

    const events = {
      onClick: this.onClick,
      ...getRippleEvents(this.props, () => this.ripples),
    };

    return (
      <Root {...events}>
        <Name>Item 2</Name>
        <Icon activated={activated} />
        <Ripples ref={r => (this.ripples = r)} color="#000" />
        <List activated={activated}>
          <Item>Item 1</Item>
          <Item>Item 2</Item>
          <Item>Item 3</Item>
          <Item>Item 4</Item>
        </List>
      </Root>
    );
  }
}
