import * as React from 'react';

import { colors } from '../../../defaults/colors';
import { Icon, Overlay, StyledButton } from './styles';
import Ripple from '../Ripple';

export type ButtonEvent = (e?: React.SyntheticEvent<HTMLDivElement>) => void;

export interface Props {
  background?: string;
  foreground?: string;
  icon?: string;
  whiteIcon?: boolean;
  inline?: boolean;
  disabled?: boolean;
  style?: any;
  onClick?: ButtonEvent;
  text?: boolean;
  contained?: boolean;
}

export default class Button extends React.Component<Props, {}> {
  public static defaultProps: Props = {
    background: colors.blue['500'],
    foreground: '#fff',
    whiteIcon: true,
    inline: false,
    disabled: false,
    contained: true,
  };

  private ripple: Ripple;

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.ripple.makeRipple(e.pageX, e.pageY);
  };

  public render() {
    const {
      background,
      foreground,
      icon,
      whiteIcon,
      inline,
      disabled,
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
          disabled={disabled}
          onMouseDown={this.onMouseDown}
          onClick={onClick}
        >
          {icon && <Icon src={icon} white={whiteIcon} disabled={disabled} />}
          {children}
          <Overlay className="overlay" color={foreground} />
          <Ripple ref={r => (this.ripple = r)} color={foreground} />
        </StyledButton>
      </React.Fragment>
    );
  }
}
