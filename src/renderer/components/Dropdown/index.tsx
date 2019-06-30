import * as React from 'react';

import { ERROR_COLOR, colors } from '~/renderer/constants';
import {
  StyledDropdown,
  Label,
  DropIcon,
  Menu,
  Indicator,
  Value,
} from './styles';

interface Props {
  label?: string;
  color?: string;
  defaultValue?: string;
  children?: any;
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
    label: 'Label',
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
    this.setState({
      activated: true,
      error: false,
      visible: true,
    });

    requestAnimationFrame(() => {
      this.removeListener();
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
    e.preventDefault();
    this.hide();
  };

  public get value() {
    const { defaultValue } = this.props;
    const { selected } = this.state;
    return selected || defaultValue;
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
    if (label == null) return;
    this.setState({ selected: label });
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

  render() {
    const { label, color, children, style } = this.props;
    const { activated, selected, error, visible } = this.state;

    const primaryColor = error ? ERROR_COLOR : color;

    return (
      <StyledDropdown activated={activated} onClick={this.show} style={style}>
        <Label
          color={primaryColor}
          activated={activated}
          focused={selected != null || activated}
        >
          {label}
        </Label>
        <Value>{selected}</Value>
        <DropIcon activated={visible} />
        <Menu visible={visible}>
          {React.Children.map(children, child => {
            const label = child.props.children;
            return React.cloneElement(child, {
              selected: this.value === label,
              onClick: this.onItemClick(label),
            });
          })}
        </Menu>
        <Indicator activated={activated} color={primaryColor} />
      </StyledDropdown>
    );
  }
}
