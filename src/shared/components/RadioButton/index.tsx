import * as React from 'react';

// Utils
import { getRippleEvents } from '../../utils/ripple';

// Defaults
import colors from '../../defaults/colors';

// Enums
import { UITheme } from '../../enums';

// Styles & Components
import Ripples from '../Ripples';
import {
  Border,
  Circle,
  StyledRadioButton,
  ComponentText,
  Container
} from './styles';

export interface IProps {
  className?: string;
  style?: {};
  disabled?: boolean;
  color?: string;
  theme?: UITheme;
  onClick?: (e: object, component?: RadioButton) => void;
  toggled?: boolean;
}

export interface IState {
  toggled: boolean;
  borderAnimations: boolean;
  fullBorderSize: boolean;
  circleVisible: boolean;
  fullCircleSize: boolean;
  animation: boolean;
}

export default class RadioButton extends React.Component<IProps, IState> {
  public static defaultProps = {
    color: colors.blue['500'],
    theme: UITheme.Light,
    ripple: true
  };

  public state: IState = {
    toggled: false,
    borderAnimations: true,
    fullBorderSize: false,
    circleVisible: false,
    fullCircleSize: true,
    animation: false
  };

  private timeouts: any = [];
  private radioButton: HTMLDivElement;
  private ripples: Ripples;

  public getRippleLeft = () => -this.radioButton.offsetWidth;

  public getRippleTop = () => -this.radioButton.offsetHeight;

  public toggle = (flag = !this.state.toggled) => {
    this.setState({
      toggled: flag,
      animation: true
    });

    if (flag) {
      this.setState({ fullBorderSize: true });

      for (const timeout of this.timeouts) {
        clearTimeout(timeout);
      }

      this.timeouts = [];

      this.timeouts.push(
        setTimeout(() => {
          this.setState({
            borderAnimations: false,
            circleVisible: true,
            fullBorderSize: false,
            fullCircleSize: false,
            animation: false
          });
        }, 300)
      );
    } else {
      this.setState({ fullCircleSize: true });

      for (const timeout of this.timeouts) {
        clearTimeout(timeout);
      }

      this.timeouts = [];

      this.timeouts.push(
        setTimeout(() => {
          this.timeouts.push(
            this.setState({
              circleVisible: false,
              fullBorderSize: true
            })
          );

          this.timeouts.push(
            setTimeout(() => {
              this.setState({ borderAnimations: true });

              this.timeouts.push(
                setTimeout(() => {
                  this.setState({
                    fullBorderSize: false,
                    animation: false
                  });
                })
              );
            })
          );
        }, 200)
      );
    }
  };

  public render() {
    const { className, children, theme, disabled, color } = this.props;

    const {
      toggled,
      fullBorderSize,
      fullCircleSize,
      animation,
      borderAnimations,
      circleVisible
    } = this.state;

    const borderWidth = fullBorderSize ? this.radioButton.offsetWidth / 2 : 2;
    const circleSize = fullCircleSize ? 14 : 9;

    const events = {
      ...getRippleEvents(this.props, () => this.ripples)
    };

    return (
      <Container disabled={disabled} {...events}>
        <div style={{ position: 'relative' }}>
          <StyledRadioButton
            innerRef={r => (this.radioButton = r)}
            scaleAnimation={animation}
          >
            <Border
              borderWidth={borderWidth}
              animations={borderAnimations}
              color={color}
              toggled={toggled}
              disabled={disabled}
              theme={theme}
            />
            <Circle
              size={circleSize}
              visible={circleVisible}
              color={color}
              toggled={toggled}
              disabled={disabled}
              theme={theme}
            />
          </StyledRadioButton>
          <Ripples
            icon
            ref={r => (this.ripples = r)}
            parentWidth={18}
            parentHeight={18}
            rippleTime={0.7}
            initialOpacity={0.1}
          />
        </div>
        {children != null && (
          <ComponentText theme={theme} disabled={disabled}>
            {children}
          </ComponentText>
        )}
      </Container>
    );
  }
}
