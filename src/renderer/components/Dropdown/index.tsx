import * as React from 'react';

import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuItemProps,
} from '../ContextMenu';
import { StyledDropdown, Label, DropIcon } from './styles';

interface ItemProps extends ContextMenuItemProps {
  value: string;
  children?: any;
}

const Item = (props: ItemProps) => {
  return <ContextMenuItem {...props}>{props.children}</ContextMenuItem>;
};

interface Props {
  color?: string;
  children?: any;
  defaultValue?: any;
  onChange?: (newValue?: any, oldValue?: any) => void;
  onMouseDown?: (e: React.MouseEvent<any>) => void;
  style?: any;
}

interface State {
  expanded: boolean;
  label?: string;
  value?: string;
}

export class Dropdown extends React.PureComponent<Props, State> {
  public static Item = Item;

  public state: State = {
    expanded: false,
  };

  componentDidMount() {
    const { defaultValue } = this.props;

    if (defaultValue != null) {
      this.setValue(defaultValue, false);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.defaultValue !== prevProps.defaultValue) {
      this.setValue(this.props.defaultValue, false);
    }
  }

  public setValue(value: string, emitEvent = true) {
    const { onChange, children } = this.props;
    const oldValue = this.state.value;
    const el = children.find((r: any) => r.props.value === value);

    if (el) {
      this.setState({
        value,
        label: el.props.children,
      });

      if (emitEvent && onChange) {
        onChange(value, oldValue);
      }
    }
  }

  public toggleMenu(val: boolean) {
    this.setState({ expanded: val });

    requestAnimationFrame(() => {
      if (val) {
        window.addEventListener('mousedown', this.onWindowMouseDown);
      } else {
        window.removeEventListener('mousedown', this.onWindowMouseDown);
      }
    });
  }

  private onItemClick = (value: string) => () => {
    this.setValue(value);
    this.toggleMenu(false);
  };

  private onItemMouseDown = (e: React.MouseEvent<any>) => {
    e.stopPropagation();
  };

  private onMouseDown = (e: React.MouseEvent<any>) => {
    e.stopPropagation();

    if (this.props.onMouseDown) this.props.onMouseDown(e);

    const { expanded } = this.state;
    this.toggleMenu(!expanded);
  };

  public onWindowMouseDown = () => {
    this.toggleMenu(false);
  };

  render() {
    const { children, style } = this.props;
    const { expanded, label, value } = this.state;

    return (
      <StyledDropdown
        className="dropdown"
        onMouseDown={this.onMouseDown}
        style={style}
      >
        <Label>{label}</Label>
        <DropIcon expanded={expanded} />
        <ContextMenu style={{ top: 32, width: '100%' }} visible={expanded}>
          {React.Children.map(children, (child) => {
            const { props } = child;

            return React.cloneElement(child, {
              selected: value === props.value,
              onClick: this.onItemClick(props.value),
              onMouseDown: this.onItemMouseDown,
            });
          })}
        </ContextMenu>
      </StyledDropdown>
    );
  }
}
