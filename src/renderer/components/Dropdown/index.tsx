import * as React from 'react';

import { colors } from '~/renderer/constants';
import { StyledDropdown, DropIcon, Value } from './styles';
import { ContextMenu, ContextMenuItem } from '../ContextMenu';

const Item = ({
  selected,
  value,
  onClick,
  onMouseDown,
  children,
  dense,
}: {
  selected?: boolean;
  value?: any;
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  children?: any;
  isDefault?: boolean;
  dense?: boolean;
}) => {
  return (
    <ContextMenuItem
      selected={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
      dense={dense}
    >
      {children}
    </ContextMenuItem>
  );
};

interface Props {
  color?: string;
  children?: any;
  defaultValue?: any;
  onChange?: (newValue?: any, oldValue?: any) => void;
  style?: any;
}

interface State {
  visible: boolean;
  selectedValue?: any;
  selectedLabel?: string;
}

export class Dropdown extends React.PureComponent<Props, State> {
  static defaultProps: Props = {
    color: colors.blue['500'],
  };

  static Item = Item;

  public state: State = {
    visible: false,
  };

  componentDidMount() {
    const { defaultValue } = this.props;
    this.value = defaultValue;
  }

  componentWillUnmount() {
    this.removeListener();
  }

  public addListener() {
    window.addEventListener('mousedown', this.onWindowMouseDown);
  }

  public removeListener() {
    window.removeEventListener('mousedown', this.onWindowMouseDown);
  }

  public show = () => {
    this.addListener();
    this.setState({ visible: true });
  };

  public hide = () => {
    requestAnimationFrame(() => {
      this.removeListener();
      this.setState({ visible: false });
    });
  };

  public onWindowMouseDown = (e: MouseEvent) => {
    e.stopPropagation();
    this.hide();
  };

  public get value() {
    const { selectedValue } = this.state;
    return selectedValue;
  }

  public set value(value: any) {
    if (value) {
      const { onChange } = this.props;
      const { selectedValue } = this.state;

      this.setState({
        selectedValue,
        selectedLabel: this.getLabel(value),
      });

      if (onChange) onChange(value, selectedValue);
    }
  }

  public onItemClick = (value: any) => () => {
    this.value = value;
    this.hide();
  };

  public clear() {
    this.setState({
      visible: false,
      selectedValue: null,
      selectedLabel: null,
    });
  }

  public onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();

    const { visible } = this.state;
    if (visible) this.hide();
    else this.show();
  };

  public onItemMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  private getLabel(value: any) {
    const { children } = this.props;
    const item = children.find(({ props }: any) => props.value === value);
    if (item) return item.props.children;
  }

  render() {
    const { children, style } = this.props;
    const { selectedLabel, visible } = this.state;

    return (
      <StyledDropdown
        className="dropdown"
        onMouseDown={this.onMouseDown}
        style={style}
      >
        <Value>{selectedLabel}</Value>
        <DropIcon activated={visible} />
        <ContextMenu style={{ top: 32, width: '100%' }} visible={visible}>
          {React.Children.map(children, child => {
            const itemValue = child.props.value;
            return React.cloneElement(child, {
              selected: this.value === itemValue,
              onClick: this.onItemClick(itemValue),
              onMouseDown: this.onItemMouseDown,
              dense: true,
            });
          })}
        </ContextMenu>
      </StyledDropdown>
    );
  }
}
