import * as React from 'react';

import { getRippleEvents } from '../../utils/ripple';

import colors from '../../defaults/colors';
import { UITheme } from '../../enums';

import {
  Container,
  StyledSwitch,
  Thumb,
  ThumbContainer,
  Track,
  ComponentText
} from './styles';
import Ripples from '../Ripples';

export interface IProps {
  className?: string;
  style?: {};
  disabled?: boolean;
  color?: string;
  theme?: UITheme;
  toggled?: boolean;
  ripple?: boolean;
}

export interface IState {
  toggled: boolean;
  thumbLeft: number;
  thumbScaleAnimation: boolean;
}

export default class Switch extends React.Component<IProps, IState> {
  public static defaultProps = {
    color: colors.blue['500'],
    theme: UITheme.Light,
    ripple: true
  };

  public state: IState = {
    toggled: false,
    thumbLeft: -10,
    thumbScaleAnimation: false
  };

  private track: HTMLDivElement;
  private thumb: HTMLDivElement;
  private ripples: Ripples;

  public getRippleLeft = () => -this.thumb.offsetWidth;

  public getRippleTop = () => -this.thumb.offsetHeight;

  public toggle(flag: boolean) {
    this.setState({
      toggled: flag,
      thumbLeft: flag
        ? this.track.offsetWidth - this.thumb.offsetWidth / 2
        : -this.thumb.offsetWidth / 2,
      thumbScaleAnimation: true
    });

    setTimeout(() => {
      this.setState({ thumbScaleAnimation: false });
    }, 100);
  }

  public render() {
    const { className, children, theme, disabled, color } = this.props;

    const { toggled, thumbLeft, thumbScaleAnimation } = this.state;

    const events = {
      ...getRippleEvents(this.props, () => this.ripples)
    };

    return (
      <Container disabled={disabled} {...events}>
        {children != null && (
          <ComponentText theme={theme} disabled={disabled}>
            {children}
          </ComponentText>
        )}

        <StyledSwitch>
          <Track
            innerRef={r => (this.track = r)}
            disabled={disabled}
            toggled={toggled}
            theme={theme}
            color={color}
          />
          <ThumbContainer toggled={toggled} left={thumbLeft}>
            <Thumb
              innerRef={r => (this.thumb = r)}
              toggled={toggled}
              disabled={disabled}
              color={color}
              theme={theme}
              thumbScaleAnimation={thumbScaleAnimation}
            />
            <Ripples
              icon
              ref={r => (this.ripples = r)}
              parentWidth={20}
              parentHeight={20}
              rippleTime={0.6}
              initialOpacity={0.1}
              hoverOverShade={false}
            />
          </ThumbContainer>
        </StyledSwitch>
      </Container>
    );
  }
}
