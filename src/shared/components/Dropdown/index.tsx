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
  selectedItem?: Item;
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

  private items: Item[] = [];

  public componentDidMount() {
    const { selectedItem } = this.state;

    if (selectedItem == null && this.items.length > 0) {
      this.setState({
        selectedItem: this.items[0],
      });
    }

    window.addEventListener('keydown', this.onWindowKeyDown);
  }

  public componentWillUnmount() {
    window.removeEventListener('mousedown', this.onWindowMouseDown);
  }

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

  public onItemClick = (e: React.SyntheticEvent<any>, item: Item) => {
    if (item) {
      this.setState({ selectedItem: item });
      this.toggle(false);
    }
  };

  public onWindowMouseDown = () => {
    this.toggle(false);
    window.removeEventListener('mousedown', this.onWindowMouseDown);
  };

  public onWindowKeyDown = (e: KeyboardEvent) => {
    const { selectedItem } = this.state;
    const key = e.key;

    if (selectedItem == null || (key !== 'ArrowDown' && key !== 'ArrowUp')) {
      return;
    }

    let index = this.items.indexOf(selectedItem);
    const maxIndex = this.items.length - 1;

    if (key === 'ArrowDown') {
      index = index === maxIndex ? 0 : index + 1;
    } else {
      index = index === 0 ? maxIndex : index - 1;
    }

    this.setState({
      selectedItem: this.items[index],
    });
  };

  public toggle = (flag: boolean) => {
    this.setState({
      activated: flag,
      listHeight: flag ? this.listContainer.scrollHeight : 0,
    });
  };

  public render() {
    const { ripple, customRippleBehavior, children } = this.props;
    const { activated, listHeight, selectedItem } = this.state;

    this.items = [];

    const events = {
      onClick: this.onClick,
      ...getRippleEvents(this.props, () => this.ripples),
    };

    return (
      <Root onMouseDown={this.onMouseDown}>
        <Container {...events}>
          <Name>{selectedItem && selectedItem.props.children}</Name>
          <Icon activated={activated} />
          <Ripples ref={r => (this.ripples = r)} color="#000" />
        </Container>
        {children != null && (
          <List innerRef={r => (this.listContainer = r)} height={listHeight} activated={activated}>
            {React.Children.map(children, (el: React.ReactElement<any>) =>
              React.cloneElement(el, {
                ref: (r: Item) => r != null && this.items.push(r),
                onClick: this.onItemClick,
                selectedItem,
              }))}
          </List>
        )}
      </Root>
    );
  }
}
