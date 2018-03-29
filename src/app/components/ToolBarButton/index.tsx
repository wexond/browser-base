import React from 'react';
import { Ripples } from 'nersent-ui';
import { observer } from 'mobx-react'; // eslint-disable-line

// Enums
import { Icons } from '../../enums';

import { Button, Icon } from './styles';

import Store from '../../store';

interface Props {
  onClick?: (e?: React.SyntheticEvent<HTMLDivElement>) => void;
  size?: number;
  style?: any;
  icon: Icons;
  innerRef?: (ref: HTMLDivElement) => void;
}

@observer
export default class ToolBarButton extends React.Component<Props, {}> {
  public static defaultProps = {
    size: 20,
  };

  private ripples: Ripples;

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.ripples.makeRipple(e.pageX, e.pageY);
  };

  public onMouseUp = () => {
    this.ripples.removeRipples();
  };

  public render() {
    const {
      icon, onClick, size, style,
    } = this.props;

    return (
      <Button
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onClick={onClick}
        style={style}
        innerRef={this.props.innerRef}
      >
        <Icon icon={icon} size={size} />
        <Ripples
          icon
          ref={r => (this.ripples = r)}
          color="#000"
          parentWidth={Store.theme.toolbarButtons.width}
          parentHeight={Store.theme.toolbar.height}
          rippleTime={0.6}
          initialOpacity={0.1}
          size={Store.theme.toolbarButtons.rippleSize}
        />
      </Button>
    );
  }
}
