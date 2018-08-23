import * as React from 'react';

import Item from '../ContextMenuItem';
import Separator from '../ContextMenuSeparator';
import { StyledMenu } from './styles';

export type ButtonEvent = (e?: React.SyntheticEvent<HTMLDivElement>) => void;

export interface IProps {
  visible?: boolean;
  onClick?: ButtonEvent;
  onMouseDown?: ButtonEvent;
  style?: any;
  className?: string;
  width?: number;
}

export interface IState {
  visible: boolean;
}

export default class ContextMenu extends React.Component<IProps, IState> {
  public static Item = Item;

  public static Separator = Separator;

  public static defaultProps = {
    hideMenuOnMouseDown: true,
  };

  public state: IState = {
    visible: false,
  };

  private menu: HTMLDivElement;

  public getHeight() {
    return this.menu.scrollHeight;
  }

  public render() {
    const {
      style,
      className,
      children,
      width,
      visible,
      onMouseDown,
    } = this.props;

    return (
      <StyledMenu
        innerRef={r => (this.menu = r)}
        width={width}
        visible={visible}
        className={className}
        style={style}
        onMouseDown={onMouseDown}
      >
        {children}
      </StyledMenu>
    );
  }
}
