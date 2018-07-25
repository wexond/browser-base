import * as React from 'react';
import { getRippleEvents } from '../../../utils/ripple';
import Ripples from '../../Ripples';
import { Root } from './styles';

export interface Props {
  onClick?: (e: React.MouseEvent<HTMLDivElement>, element?: Item) => void;
  selectedItem?: Item; // eslint-disable-line
  ripple?: boolean;
  customRippleBehavior?: boolean;
  data?: any;
}

export default class Item extends React.Component<Props, {}> {
  public static defaultProps = {
    customRippleBehavior: false,
    ripple: true,
  };

  private ripples: Ripples;

  private onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick(e, this);
    }
  };

  public render() {
    const { children, selectedItem } = this.props;
    const selected = selectedItem === this;

    const events = {
      onClick: this.onClick,
      ...getRippleEvents(this.props, () => this.ripples),
    };

    return (
      <Root selected={selected} {...events}>
        {children}
        <Ripples ref={r => (this.ripples = r)} color="#000" />
      </Root>
    );
  }
}
