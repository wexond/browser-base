import * as React from 'react';
import { getEvents } from '../../utils/events';
import { getRippleEvents } from '../../utils/ripple';
import Ripples from '../Ripples';
import Item from './Item';
import colors from '../../defaults/colors';
import {
  Root, Container, Name, Icon, List,
} from './styles';

export interface IProps {
  ripple?: boolean;
  customRippleBehavior?: boolean;
  children?: any;
}

export interface IState {
  activated: boolean;
  listHeight: number;
}

export default class Button extends React.Component<IProps, IState> {
  public static defaultProps = {
    customRippleBehavior: false,
    ripple: true,
  };

  public static Item = Item;

  public state: IState = {
    activated: false,
    listHeight: 0,
  };

  private ripples: Ripples;

  private listContainer: HTMLDivElement;

  public onClick = () => {
    const { activated } = this.state;

    if (activated) {
      window.removeEventListener('mousedown', this.onWindowMouseDown);
    } else {
      window.addEventListener('mousedown', this.onWindowMouseDown);
    }

    this.toggle(!activated);
  };

  public onMouseDown = (e: React.SyntheticEvent<any>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  public onWindowMouseDown = () => {
    this.toggle(false);
    window.removeEventListener('mousedown', this.onWindowMouseDown);
  };

  public toggle = (flag: boolean) => {
    this.setState({
      activated: flag,
      listHeight: flag ? this.listContainer.scrollHeight : 0,
    });
  };

  public render() {
    const { ripple, customRippleBehavior, children } = this.props;
    const { activated, listHeight } = this.state;

    const events = {
      onClick: this.onClick,
      ...getRippleEvents(this.props, () => this.ripples),
    };

    return (
      <Root onMouseDown={this.onMouseDown}>
        <Container {...events}>
          <Name>Item 2</Name>
          <Icon activated={activated} />
          <Ripples ref={r => (this.ripples = r)} color="#000" />
        </Container>
        {children != null && (
          <List innerRef={r => (this.listContainer = r)} height={listHeight} activated={activated}>
            {React.Children.map(children, (el: React.ReactElement<any>) =>
              React.cloneElement(el, {}))}
          </List>
        )}
      </Root>
    );
  }
}
