import * as React from 'react';

import { colors } from '../../../defaults/colors';
import { ButtonType } from '../../../enums';
import { getEvents, getRippleEvents } from '../../../utils';
import Ripples from '../Ripples';
import { Icon, Overlay, StyledButton } from './styles';

export type ButtonEvent = (e?: React.SyntheticEvent<HTMLDivElement>) => void;

export interface IProps {
  background?: string;
  foreground?: string;
  icon?: string;
  whiteIcon?: boolean;
  inline?: boolean;
  disabled?: boolean;
  ripple?: boolean;
  customRippleBehavior?: boolean;
  theme?: 'light' | 'dark';
  type?: ButtonType;
  style?: any;
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
    background: colors.blue['500'],
    foreground: '#fff',
    whiteIcon: true,
    inline: false,
    disabled: false,
    customRippleBehavior: false,
    ripple: true,
    theme: 'light',
    type: ButtonType.Contained,
  };

  private ripples: Ripples;

  public render() {
    const {
      background,
      foreground,
      icon,
      whiteIcon,
      inline,
      type,
      ripple,
      customRippleBehavior,
      disabled,
      theme,
      style,
      children,
    } = this.props;

    const events = {
      ...getEvents(this.props),
      ...getRippleEvents(this.props, () => this.ripples),
    };

    return (
      <React.Fragment>
        {!inline && <div style={{ clear: 'both' }} />}
        <StyledButton
          className="material-button"
          background={background}
          foreground={foreground}
          icon={icon ? true : undefined}
          style={style}
          type={type}
          theme={theme}
          disabled={disabled}
          {...events}
        >
          {icon && <Icon src={icon} white={whiteIcon} disabled={disabled} theme={theme} />}
          {children}
          <Overlay className="overlay" color={foreground} />
          <Ripples ref={(r) => (this.ripples = r)} color={foreground} disabled={disabled} />
        </StyledButton>
      </React.Fragment>
    );
  }
}
