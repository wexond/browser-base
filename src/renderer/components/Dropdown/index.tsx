import * as React from 'react';

import { colors } from '~/renderer/constants';
import { StyledDropdown, DropIcon, Menu, Value } from './styles';

interface Props {
  color?: string;
  defaultValue?: string;
  children?: any;
  onChange?: (newValue?: any, oldValue?: any) => void;
  style?: any;
}

interface State {
  activated: boolean;
  selected?: string;
  error: boolean;
  visible: boolean;
}

export class Dropdown extends React.PureComponent<Props, State> {
  static defaultProps: Props = {
    color: colors.blue['500'],
  };

  public state: State = {
    activated: false,
    error: false,
    visible: false,
  };

  public componentWillUnmount() {
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
    this.setState({
      activated: true,
      error: false,
      visible: true,
    });
  };

  public hide = () => {
    requestAnimationFrame(() => {
      this.removeListener();
      this.setState({
        activated: false,
        visible: false,
      });
    });
  };

  public onWindowMouseDown = (e: MouseEvent) => {
    e.stopPropagation();
    this.hide();
  };

  public get value() {
    const { defaultValue } = this.props;
    const { selected } = this.state;
    return selected || defaultValue;
  }

  public set value(str: string) {
    const { onChange } = this.props;
    const { selected } = this.state;

    if (str === selected) return;

    this.setState({ selected: str });
    if (onChange) onChange(str, selected);
  }

  public test() {
    const error = this.value == null;
    this.setState({
      activated: error,
      error,
    });
    return !error;
  }

  public onItemClick = (label: string) => () => {
    this.value = label;
    this.hide();
  };

  public clear() {
    this.setState({
      activated: false,
      error: false,
      selected: null,
      visible: false,
    });
  }

  public onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  render() {
    const { color, children, style } = this.props;
    const { activated, error, visible } = this.state;
    const value = this.value;

    return (
      <StyledDropdown
        activated={activated}
        onClick={this.show}
        style={style}
        onMouseDown={this.onMouseDown}
      >
        <Value>{value}</Value>
        <DropIcon activated={visible} />
        <Menu visible={visible}>
          {React.Children.map(children, child => {
            const label = child.props.children;
            return React.cloneElement(child, {
              selected: this.value === label,
              onClick: this.onItemClick(label),
              onMouseDown: this.onMouseDown,
            });
          })}
        </Menu>
      </StyledDropdown>
    );
  }
}
