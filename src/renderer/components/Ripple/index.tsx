import React from 'react';
import { StyledRipple } from './styles';

export interface IProps {
  height: number;
  width: number;
  color: string;
  initialOpacity: number;
  fadeOutTime: number;
  rippleTime: number;
  x: number;
  y: number;
  removeRipple: (id: number) => void;
  id: number;
  isRemoving: boolean;
  icon: boolean;
}

export interface IRipple {
  color: string;
}

export interface IState {
  width: number;
  height: number;
  opacity: number;
}

export default class Ripple extends React.Component<IProps, IState> {
  public state = {
    width: 0,
    height: 0,
    opacity: 1,
  };

  public timeouts: any[] = [];

  public componentDidMount() {
    const { height, width, initialOpacity } = this.props;

    this.setState({
      opacity: initialOpacity,
    });

    this.timeouts.push(
      setTimeout(() => {
        this.setState({
          width,
          height,
        });
      }),
    );
  }

  public remove() {
    const { removeRipple, id, fadeOutTime } = this.props;

    this.timeouts.push(
      setTimeout(() => {
        this.setState({
          opacity: 0,
        });
        this.timeouts.push(
          setTimeout(() => {
            removeRipple(id);
          },         fadeOutTime * 1000),
        );
      },         100),
    );
  }

  public componentWillUnmount() {
    this.timeouts.forEach(clearTimeout);
  }

  public render() {
    const { height, width, opacity } = this.state;
    const {
      color, x, y, isRemoving, rippleTime, fadeOutTime, icon,
    } = this.props;

    if (isRemoving) {
      this.remove();
    }

    return (
      <StyledRipple
        height={height}
        width={width}
        color={color}
        opacity={opacity}
        rippleTime={rippleTime}
        fadeOutTime={fadeOutTime}
        icon={icon ? 1 : 0}
        x={x}
        y={y}
      />
    );
  }
}
