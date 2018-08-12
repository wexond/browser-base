import * as React from 'react';

import { colors } from '../../../defaults/colors';
import { ButtonType } from '../../../enums';
import { Icon, Overlay, StyledButton } from './styles';
import Ripple from '../Ripple';

export type ButtonEvent = (e?: React.SyntheticEvent<HTMLDivElement>) => void;

export interface IProps {
  background?: string;
  foreground?: string;
  icon?: string;
  whiteIcon?: boolean;
  inline?: boolean;
  disabled?: boolean;
  theme?: 'light' | 'dark';
  type?: ButtonType;
  style?: any;
  onClick?: ButtonEvent;
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

  private ripple: Ripple;

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.ripple.makeRipple(e.pageX, e.pageY);
  }

  public render() {
    const {
      background,
      foreground,
      icon,
      whiteIcon,
      inline,
      type,
      disabled,
      theme,
      style,
      children,
      onClick,
    } = this.props;

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
          onMouseDown={this.onMouseDown}
          onClick={onClick}
        >
          {icon && (
            <Icon
              src={icon}
              white={whiteIcon}
              disabled={disabled}
              theme={theme}
            />
          )}
          {children}
          <Overlay className="overlay" color={foreground} />
          <Ripple ref={r => (this.ripple = r)} color={foreground} />
        </StyledButton>
      </React.Fragment>
    );
  }
}
