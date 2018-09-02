import * as React from 'react';
import { Container, Icon, List, Name, Root } from './styles';
import Ripple from '../Ripple';
import DropdownItem from '@components/DropdownItem';

export type DropdownEvent = (e?: React.MouseEvent<any>) => void;

export interface Props {
  ripple?: boolean;
  customRippleBehavior?: boolean;
  children?: any;
  style?: any;
  onChange?: (value?: any) => void;
  onMouseUp?: DropdownEvent;
}

export interface State {
  activated: boolean;
  listHeight: number;
  selectedItem: number;
}

export default class Dropdown extends React.Component<Props, State> {
  public static Item = DropdownItem;

  public static defaultProps = {
    customRippleBehavior: false,
    ripple: true,
  };

  public state: State = {
    activated: false,
    listHeight: 0,
    selectedItem: 0,
  };

  public ripple: Ripple;

  public listContainer: HTMLDivElement;

  public items: DropdownItem[] = [];

  public componentDidMount() {
    window.addEventListener('keydown', this.onWindowKeyDown);
  }

  public componentWillUnmount() {
    window.removeEventListener('mousedown', this.onWindowMouseDown);
  }

  public onClick = () => {
    if (this.items.length === 0) {
      return;
    }
    const { activated } = this.state;

    if (activated) {
      window.removeEventListener('mousedown', this.onWindowMouseDown);
    } else {
      window.addEventListener('mousedown', this.onWindowMouseDown);
    }

    this.toggle(!activated);
  };

  public onMouseDown = (e: React.MouseEvent<any>) => {
    e.preventDefault();
    e.stopPropagation();
    this.ripple.makeRipple(e.pageX, e.pageY);
  };

  public onItemClick = (e: React.MouseEvent<any>, item: DropdownItem) => {
    if (item) {
      this.setState({ selectedItem: item.props.id });
      this.toggle(false);
      this.onChange(item);
    }
  };

  public onWindowMouseDown = () => {
    this.toggle(false);
    window.removeEventListener('mousedown', this.onWindowMouseDown);
  };

  public onWindowKeyDown = (e: KeyboardEvent) => {
    const { selectedItem } = this.state;
    const key = e.key;

    let index = selectedItem;
    const maxIndex = this.items.length - 1;

    if (key === 'Enter' || key === 'Escape') {
      this.toggle(false);
    } else if (key === 'ArrowDown') {
      index = index === maxIndex ? 0 : index + 1;
    } else if (key === 'ArrowUp') {
      index = index === 0 ? maxIndex : index - 1;
    }

    if (selectedItem !== index) {
      this.onChange(this.items.find(x => x.props.id === index));
    }
    this.setState({ selectedItem: index });
  };

  public toggle = (flag: boolean) => {
    this.setState({
      activated: flag,
      listHeight: flag ? this.listContainer.scrollHeight : 0,
    });
  };

  public onChange = (item: DropdownItem) => {
    const { onChange } = this.props;

    if (typeof onChange === 'function') {
      onChange(item.props.value);
    }
  };

  public render() {
    const { children, style, onMouseUp } = this.props;
    const { activated, listHeight, selectedItem } = this.state;

    this.items = this.items.filter(Boolean);

    const events = {
      onClick: this.onClick,
    };

    let id = 0;

    const item = this.items.find(x => x.props.id === selectedItem);

    return (
      <Root onMouseDown={this.onMouseDown} onMouseUp={onMouseUp} style={style}>
        <Container {...events}>
          <Name>{item && item.props.children}</Name>
          <Icon activated={activated} />
          <Ripple ref={r => (this.ripple = r)} color="#000" />
        </Container>
        {children != null && (
          <List
            innerRef={r => (this.listContainer = r)}
            height={listHeight}
            activated={activated}
          >
            {React.Children.map(children, (el: React.ReactElement<any>) =>
              React.cloneElement(el, {
                ref: (r: DropdownItem) => r != null && this.items.push(r),
                onClick: this.onItemClick,
                selected: selectedItem === id,
                id: id++,
              }),
            )}
          </List>
        )}
      </Root>
    );
  }
}
