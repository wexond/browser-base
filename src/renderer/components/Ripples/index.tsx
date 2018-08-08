import React from 'react';
import Ripple from '../Ripple';
import { IconRipple, StyledRipples } from './styles';

export interface IProps {
  className?: string;
  style?: {};
  center?: boolean;
  scale?: number;
  fadeOutTime?: number;
  rippleTime?: number;
  initialOpacity?: number;
  color?: string;
  icon?: boolean;
  parentHeight?: number;
  parentWidth?: number;
  hoverOverShade?: boolean;
  disabled?: boolean;
  size?: number;
}

export interface IRipple {
  x: number;
  y: number;
  id: number;
  isRemoving: boolean;
}

export interface IState {
  ripples: IRipple[];
}

let nextRippleId = -1;

export default class Ripples extends React.Component<IProps, IState> {
  public static defaultProps: IProps = {
    center: false,
    scale: 16,
    fadeOutTime: 0.6,
    initialOpacity: 0.2,
    color: '#000',
    rippleTime: 0.6,
    icon: false,
    hoverOverShade: true,
    disabled: false,
    size: 42,
  };

  public state: IState = {
    ripples: [],
  };

  private ripples: HTMLDivElement;

  private currentRipple: IRipple;

  private isTouched = false;

  public componentDidMount() {
    window.addEventListener('mouseup', this.removeRipples);
  }

  public componentWillUnmount() {
    window.removeEventListener('mouseup', this.removeRipples);
  }

  public makeRipple(mouseX: number, mouseY: number, isTouch = false) {
    const { disabled } = this.props;
    const { ripples } = this.state;

    if ((!isTouch && this.isTouched) || disabled) {
      return;
    }

    const newRipple: IRipple = {
      ...this.getRipplePosition(0, mouseX, mouseY),
      id: nextRippleId++,
      isRemoving: false,
    };

    this.currentRipple = newRipple;

    this.setState({
      ripples: [...ripples, newRipple],
    });

    if (isTouch && !this.isTouched) {
      this.isTouched = true;
    }
  }

  public removeRipple = (id: number) => {
    const { ripples } = this.state;

    const index = ripples.indexOf(
      ripples.filter(ripple => ripple.id === id)[0],
    );

    this.setState({
      ripples: [...ripples.slice(0, index), ...ripples.slice(index + 1)],
    });
  }

  public removeRipples = () => {
    const { ripples } = this.state;

    this.setState({
      ripples: [
        ...ripples.map((ripple: IRipple) => {
          const newRipple: IRipple = { ...ripple };
          newRipple.isRemoving = true;
          return newRipple;
        }),
      ],
    });
  }

  public getRipplePosition(offsetX = 0, x = 0, y = 0) {
    return {
      x: x - this.ripples.getBoundingClientRect().left,
      y: y - this.ripples.getBoundingClientRect().top,
    };
  }

  public render() {
    const { color, disabled, size } = this.props;
    const { ripples } = this.state;

    const {
      className,
      fadeOutTime,
      initialOpacity,
      rippleTime,
      icon,
      parentWidth,
      parentHeight,
      hoverOverShade,
    } = this.props;

    const component = (
      <StyledRipples innerRef={r => (this.ripples = r)}>
        {ripples.map((ripple: IRipple) => {
          const { offsetHeight, offsetWidth } = this.ripples;
          const { id, x, y, isRemoving } = ripple;

          return (
            <Ripple
              height={offsetHeight}
              width={offsetWidth}
              fadeOutTime={fadeOutTime}
              rippleTime={rippleTime}
              removeRipple={this.removeRipple}
              initialOpacity={initialOpacity}
              color={color}
              isRemoving={isRemoving}
              icon={icon}
              x={x}
              y={y}
              id={id}
              key={id}
            />
          );
        })}
      </StyledRipples>
    );

    return (
      (icon && (
        <IconRipple
          width={parentWidth}
          height={parentHeight}
          size={size}
          color={color}
          hoverOverShade={hoverOverShade}
          disabled={disabled}
        >
          {component}
        </IconRipple>
      )) ||
      component
    );
  }
}
