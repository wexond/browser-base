import * as React from 'react';

import { colors } from '../../../defaults/colors';
import { ButtonType } from '../../../enums';
import Ripple from '../Ripple';
import { StyledButton } from './styles';

export type ButtonEvent = (e?: React.SyntheticEvent<HTMLDivElement>) => void;

export interface Props {
  background?: string;
  foreground?: string;
  inline?: boolean;
  disabled?: boolean;
  contained?: boolean;
  outlined?: boolean;
  text?: boolean;
  theme?: 'light' | 'dark';
  style?: any;
  onClick?: ButtonEvent;
}

export default class Button extends React.Component<Props, {}> {
  public static defaultProps = {
    background: colors.blue['500'],
    foreground: '#fff',
    whiteIcon: true,
    inline: false,
    disabled: false,
    customRippleBehavior: false,
    ripple: true,
    contained: true,
    outlined: false,
    text: false,
    theme: 'light',
    type: ButtonType.Contained,
  };

  private ripple: Ripple;

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.ripple.makeRipple(e.pageX, e.pageY);
  };

  public render() {
    const {
      background,
      foreground,
      inline,
      contained,
      outlined,
      text,
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
          isContained={contained}
          isOutlined={outlined}
          isText={text}
          theme={theme}
          disabled={disabled}
          onMouseDown={this.onMouseDown}
          onClick={onClick}
          style={style}
        >
          {children}
          <Ripple ref={r => (this.ripple = r)} color={foreground} />
        </StyledButton>
      </React.Fragment>
    );
  }
}
