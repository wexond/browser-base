import * as React from 'react';

import { colors } from '../../../../defaults';
import { StyledMenuItem, Title } from './styles';
import ContextMenu from '..';
import { getEvents } from '../../../../utils';

export type ButtonEvent = (e?: React.SyntheticEvent<HTMLDivElement>) => void;

export interface IProps {
  rippleColor?: string;
  customRippleBehavior?: boolean;
  onClick?: ButtonEvent;
  onMouseDown?: ButtonEvent;
  onMouseUp?: ButtonEvent;
  onMouseLeave?: ButtonEvent;
  onMouseEnter?: ButtonEvent;
  onTouchStart?: ButtonEvent;
  onTouchEnd?: ButtonEvent;
  ripple?: boolean;
  menu?: ContextMenu;
  i?: number;
  visible?: boolean;
  disabled?: boolean;
  hideMenuOnClick?: boolean;
  dense?: boolean;
  menuVisible?: boolean;
}

export interface IState {
  animation: boolean;
}

export default class MenuItem extends React.Component<IProps, IState> {
  public static defaultProps: IProps = {
    rippleColor: colors.black,
    ripple: true,
    hideMenuOnClick: true,
    visible: true,
  };

  public state: IState = {
    animation: false,
  };

  private timeout: any;

  public componentWillReceiveProps(nextProps: IProps) {
    const { menuVisible, visible } = this.props;

    if (nextProps.menuVisible && !menuVisible && visible) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.setState({ animation: true });
      }, nextProps.i * 25 + 100);
    } else if (!nextProps.menuVisible) {
      clearTimeout(this.timeout);
      this.setState({ animation: false });
    }
  }

  public onClick = (e: React.SyntheticEvent<HTMLDivElement>) => {
    const { menu, onClick, hideMenuOnClick } = this.props;
    if (hideMenuOnClick) {
      menu.toggle(false);
    }

    if (typeof onClick === 'function') {
      onClick(e);
    }
  }

  public onMouseDown = (e: React.SyntheticEvent<HTMLDivElement>) => {
    const { onMouseDown } = this.props;

    e.stopPropagation();

    if (typeof onMouseDown === 'function') {
      onMouseDown(e);
    }
  }

  public render() {
    const { rippleColor, visible, disabled, dense, children } = this.props;
    const { animation } = this.state;

    const events = {
      ...getEvents(this.props),
      onClick: this.onClick,
      onMouseDown: this.onMouseDown,
    };

    return (
      <StyledMenuItem
        disabled={disabled}
        dense={dense}
        animation={animation}
        visible={visible}
        {...events}
      >
        <Title dense={dense} disabled={disabled}>
          {children}
        </Title>
      </StyledMenuItem>
    );
  }
}
