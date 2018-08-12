import * as React from 'react';

import Item from './Item';
import Separator from './Separator';
import { StyledMenu } from './styles';

import { getEvents } from '../../../utils';

export type ButtonEvent = (e?: React.SyntheticEvent<HTMLDivElement>) => void;

export interface IProps {
  visible?: boolean;
  onClick?: ButtonEvent;
  onMouseDown?: ButtonEvent;
  style?: any;
  className?: string;
  dense?: boolean;
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
      dense,
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
        dense={dense}
        className={className}
        style={style}
        onMouseDown={onMouseDown}
      >
        {React.Children.map(children, (child: React.ReactElement<any>) =>
          React.cloneElement(child, {
            dense,
          }),
        )}
      </StyledMenu>
    );
  }
}
