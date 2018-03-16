import React, { SFC } from "react";

// Enums
import { Icons } from "../../enums";

import { Button, Icon } from "./styles";

import { Ripples } from "nersent-ui";

interface IProps {
  onClick?: (e?: React.SyntheticEvent<HTMLDivElement>) => void;
  size?: number;
  style?: any;
  icon: Icons;
}

export default class ToolBarButton extends React.PureComponent<IProps, {}> {
  public static defaultProps = {
    size: 20
  };

  private ripples: Ripples;

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.ripples.makeRipple(e.pageX, e.pageY);
  };

  public onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    this.ripples.removeRipples();
  };

  public render() {
    const { icon, onClick, size, style } = this.props;

    return (
      <Button onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onClick={onClick} style={style}>
        <Icon icon={icon} size={size} />
        <Ripples
          icon={true}
          ref={r => (this.ripples = r)}
          color={"#000"}
          parentWidth={42}
          parentHeight={48}
          rippleTime={0.7}
          initialOpacity={0.1}
        />
      </Button>
    );
  }
}
