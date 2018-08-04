import * as React from 'react';

import { StyledMenu } from './styles';
import Item from './Item';
import Separator from './Separator';

import { getEvents } from '../../../utils';

export type ButtonEvent = (e?: React.SyntheticEvent<HTMLDivElement>) => void;

export interface IProps {
  visible?: boolean;
  onClick?: ButtonEvent;
  onMouseDown?: ButtonEvent;
  onMouseUp?: ButtonEvent;
  onMouseLeave?: ButtonEvent;
  onMouseEnter?: ButtonEvent;
  style?: any;
  className?: string;
  dense?: boolean;
  width?: number;
  hideMenuOnMouseDown?: boolean;
}

export interface IState {
  visible: boolean;
  height: number;
  heightTransition: boolean;
  zIndex: number;
}

export default class ContextMenu extends React.Component<IProps, IState> {
  public static Item = Item;

  public static Separator = Separator;

  static defaultProps = {
    hideMenuOnMouseDown: true,
  };

  public state: IState = {
    visible: false,
    heightTransition: false,
    height: 0,
    zIndex: -1,
  };

  private menu: HTMLDivElement;

  private height: number;

  private timeout: any;

  public componentWillReceiveProps(nextProps: IProps) {
    this.toggle(nextProps.visible);
  }

  public toggle(flag: boolean) {
    const { visible } = this.state;

    if (flag === visible) return;

    this.setState({ visible: flag });

    if (flag) {
      this.setState({ heightTransition: false });
      clearTimeout(this.timeout);
      requestAnimationFrame(() => {
        this.setState({ height: 0, zIndex: 999 });
        this.updateHeight();
      });
    } else {
      clearTimeout(this.timeout);
      this.setState({ heightTransition: false });
      this.timeout = setTimeout(() => {
        this.setState({ zIndex: -1 });
      }, 300);
    }
  }

  public updateHeight() {
    const { visible } = this.state;
    if (visible) {
      requestAnimationFrame(() => {
        this.height = this.menu.scrollHeight;
        this.setState({ heightTransition: true, height: this.height });
      });
    }
  }

  public getHeight() {
    return this.height;
  }

  public onMouseDown = (e: React.SyntheticEvent<HTMLDivElement>) => {
    const { hideMenuOnMouseDown, onMouseDown } = this.props;

    if (hideMenuOnMouseDown) this.toggle(false);

    if (typeof onMouseDown === 'function') {
      onMouseDown(e);
    }
  };

  public render() {
    const {
      visible, height, heightTransition, zIndex,
    } = this.state;
    const {
      style, className, dense, hideMenuOnMouseDown, children, width,
    } = this.props;

    let i = 1;

    const events = {
      ...getEvents(this.props),
      onMouseDown: this.onMouseDown,
    };

    return (
      <StyledMenu
        innerRef={r => (this.menu = r)}
        width={width}
        visible={visible}
        dense={dense}
        className={className}
        style={{
          ...style,
          height,
          transition: `0.2s opacity, 0.3s margin-top ${heightTransition ? ', 0.3s height' : ''}`,
          zIndex,
        }}
        {...events}
      >
        {React.Children.map(children, child => {
          const clone = React.cloneElement(child as React.ReactElement<any>, {
            menu: this,
            dense,
            i,
            menuVisible: visible,
            hideMenuOnClick: hideMenuOnMouseDown,
          });

          if (clone.props.visible) i++;

          return clone;
        })}
      </StyledMenu>
    );
  }
}
