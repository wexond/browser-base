import * as React from 'react';

import { getEvents } from '../../utils/events';
import { getRippleEvents } from '../../utils/ripple';

import Ripples from '../Ripples';

import colors from '../../defaults/colors';
import { UITheme, ButtonType } from '../../enums';

import {
  StyledButton, Icon, Text, OverShade,
} from './styles';

export type ButtonEvent = (e?: React.SyntheticEvent<HTMLDivElement>) => void;

export interface IProps {
  background?: string;
  foreground?: string;
  whiteIcon?: boolean;
  icon?: string;
  type?: ButtonType;
  inline?: boolean;
  style?: any;
  ripple?: boolean;
  customRippleBehavior?: boolean;
  onClick?: ButtonEvent;
  onMouseDown?: ButtonEvent;
  onMouseUp?: ButtonEvent;
  onMouseLeave?: ButtonEvent;
  onMouseEnter?: ButtonEvent;
  onTouchStart?: ButtonEvent;
  onTouchEnd?: ButtonEvent;
}

export default class Button extends React.Component<IProps, {}> {
  public static defaultProps = {
    background: colors.deepPurple['500'],
    foreground: '#fff',
    whiteIcon: true,
    type: ButtonType.Contained,
    inline: false,
    customRippleBehavior: false,
    ripple: true,
  };

  private ripples: Ripples;

  public render() {
    const {
      background,
      foreground,
      whiteIcon,
      icon,
      children,
      style,
      inline,
      type,
      ripple,
      customRippleBehavior,
    } = this.props;

    const events = {
      ...getEvents(this.props),
      ...getRippleEvents(this.props, () => this.ripples),
    };

    return (
      <React.Fragment>
        <StyledButton color={background} icon={icon != null} style={style} type={type} {...events}>
          {icon != null && <Icon src={icon} white={whiteIcon} />}
          <Text color={foreground}>{children}</Text>
          <OverShade className="over-shade" color={foreground} />
          <Ripples ref={r => (this.ripples = r)} color={foreground} />
        </StyledButton>
        {!inline && <div style={{ clear: 'both' }} />}
      </React.Fragment>
    );
  }
}
