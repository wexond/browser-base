import { observer } from 'mobx-react';
import { Ripples } from 'nersent-ui';
import React from 'react';
import { Button, Icon } from './styles';
import { Icons } from '../../../shared/enums';
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
  private ref: HTMLDivElement;

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.ripples.makeRipple(e.pageX, e.pageY);
  };

  public componentDidMount() {
    this.forceUpdate();
  }

  public onMouseUp = () => {
    this.ripples.removeRipples();
  };

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
      icon, onClick, size, disabled,
    } = this.props;

    let { style } = this.props;

    style = { ...style, ...Store.theme.theme.toolbarButtons.style };

    const { height, width } = this.getSize();

    return (
      <Button
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onClick={onClick}
        style={style}
        innerRef={r => {
          this.ref = r;
          if (typeof this.props.innerRef === 'function') {
            this.props.innerRef(r);
          }
        }}
        disabled={disabled}
      >
        <Icon icon={icon} size={size} disabled={disabled} />
        <Ripples
          icon
          ref={r => (this.ripples = r)}
          color="#000"
          parentWidth={width}
          parentHeight={height}
          rippleTime={0.6}
          initialOpacity={0.1}
          size={Store.theme.theme.toolbarButtons.rippleSize}
        />
      </Button>
    );
  }
}
