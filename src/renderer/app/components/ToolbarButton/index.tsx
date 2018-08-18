import { observer } from 'mobx-react';
import React from 'react';

import { Button, Icon, Circle } from './styles';
import Ripple from '@components/Ripple';

interface Props {
  onClick?: (e?: React.SyntheticEvent<HTMLDivElement>) => void;
  onMouseDown?: (e?: React.SyntheticEvent<HTMLDivElement>) => void;
  size?: number;
  style?: any;
  icon: string;
  divRef?: (ref: HTMLDivElement) => void;
  disabled?: boolean;
  className?: string;
  children?: any;
}

@observer
export default class ToolbarButton extends React.Component<Props, {}> {
  public static defaultProps = {
    size: 20,
  };

  private ripple: Ripple;

  private ref: HTMLDivElement;

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onMouseDown } = this.props;

    this.ripple.makeRipple(e.pageX, e.pageY);

    if (typeof onMouseDown === 'function') {
      onMouseDown(e);
    }
  };

  public componentDidMount() {
    this.forceUpdate();
  }

  public getSize = () => {
    if (this.ref) {
      return {
        height: this.ref.offsetHeight,
        width: this.ref.offsetWidth,
      };
    }
    return {
      height: 0,
      width: 0,
    };
  };

  public render() {
    const {
      icon,
      onClick,
      size,
      disabled,
      className,
      divRef,
      children,
    } = this.props;

    let { style } = this.props;

    style = { ...style };

    return (
      <Button
        onMouseDown={this.onMouseDown}
        onClick={onClick}
        className={className}
        style={style}
        innerRef={r => {
          this.ref = r;
          if (typeof divRef === 'function') {
            divRef(r);
          }
        }}
        disabled={disabled}
      >
        <Icon icon={icon} size={size} disabled={disabled} />
        <Circle>
          <Ripple
            ref={r => (this.ripple = r)}
            color="#000"
            rippleTime={0.8}
            opacity={0.1}
          />
        </Circle>
        {children}
      </Button>
    );
  }
}
