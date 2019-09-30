import * as React from 'react';

import { Root, StyledRipple } from './style';

export interface IProps {
  className?: string;
  style?: {};
  fadeOutTime?: number;
  rippleTime?: number;
  opacity?: number;
  color?: string;
}

export interface IRipple {
  x: number;
  y: number;
  id: number;
  isRemoving: boolean;
}

export interface IState {
  rippleX: number;
  rippleY: number;
  rippleSize: number;
  rippleOpacity: number;
  opacityTransition: boolean;
  sizeTransition: boolean;
}

const easing = 'cubic-bezier(0.215, 0.61, 0.355, 1)';

const getSize = (x: number, y: number, width: number, height: number) => {
  if (width === 0 || height === 0) {
    return 0;
  }

  // Calculate points relative to the center of a component.
  const newX = x - width / 2;
  const newY = y - height / 2;

  let result = 2 * Math.abs(newY) + Math.abs(newX);

  if (Math.abs(newX) > Math.abs(newY)) {
    result = 2 * Math.abs(newX) + Math.abs(newY);
  }

  return Math.max(width, height) + result + 10;
};

export default class Ripple extends React.Component<IProps, IState> {
  public static defaultProps: IProps = {
    fadeOutTime: 0.6,
    opacity: 0.2,
    color: '#000',
    rippleTime: 0.6,
  };

  public state: IState = {
    rippleX: 0,
    rippleY: 0,
    rippleSize: 0,
    rippleOpacity: 0,
    opacityTransition: false,
    sizeTransition: false,
  };

  private root = React.createRef<HTMLDivElement>();

  public onMouseUp = () => {
    this.fadeOut();
    window.removeEventListener('mouseup', this.onMouseUp);
  };

  public fadeOut = () => {
    this.setState({
      rippleOpacity: 0.00000001,
      opacityTransition: true,
    });
  };

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.makeRipple(e.pageX, e.pageY);
  };

  public onMouseLeave = () => {
    this.onMouseUp();
  };

  public makeRipple(mouseX: number, mouseY: number) {
    const { opacity } = this.props;
    const {
      left,
      top,
      width,
      height,
    } = this.root.current.getBoundingClientRect();

    window.addEventListener('mouseup', this.onMouseUp);

    const x = mouseX - left;
    const y = mouseY - top;

    const size = getSize(x, y, width, height);

    this.setState({
      rippleSize: 0,
      opacityTransition: false,
      sizeTransition: false,
    });

    requestAnimationFrame(() => {
      this.setState({
        rippleX: Math.min(x, width),
        rippleY: y,
        rippleSize: size,
        rippleOpacity: opacity,
        sizeTransition: true,
      });
    });
  }

  public render() {
    const { color, fadeOutTime, rippleTime, style } = this.props;

    const {
      rippleX,
      rippleY,
      rippleSize,
      rippleOpacity,
      opacityTransition,
      sizeTransition,
    } = this.state;

    return (
      <Root
        onMouseLeave={this.onMouseLeave}
        onMouseDown={this.onMouseDown}
        ref={this.root}
        style={style}
      >
        <StyledRipple
          style={{
            transform: `translate3d(calc(-50.1% + ${rippleX}px), calc(-50.1% + ${rippleY}px), 0)`,
            width: rippleSize,
            height: rippleSize,
            transition: `0.3s background-color
            ${
              sizeTransition
                ? `, ${rippleTime}s width ${easing}, ${rippleTime}s height ${easing}`
                : ''
            }
            ${opacityTransition ? `, ${fadeOutTime}s opacity` : ''}`,
            backgroundColor: color,
            opacity: rippleOpacity,
          }}
        />
      </Root>
    );
  }
}
