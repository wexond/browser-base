import { observer } from 'mobx-react';
import { Ripples } from 'nersent-ui';
import React from 'react';
import { Button, Icon } from './styles';
import { Icons } from '../../enums';
import Store from '../../store';

interface Props {
  onClick?: (e?: React.SyntheticEvent<HTMLDivElement>) => void;
  size?: number;
  style?: any;
  icon: Icons;
  innerRef?: (ref: HTMLDivElement) => void;
  disabled?: boolean;
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
      icon, onClick, size, style, disabled,
    } = this.props;

    return (
      <Button
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onClick={onClick}
        style={style}
        innerRef={this.props.innerRef}
        disabled={disabled}
      >
        <Icon icon={icon} size={size} disabled={disabled} />
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
