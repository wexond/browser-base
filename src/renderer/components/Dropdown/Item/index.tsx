import * as React from 'react';
import { getRippleEvents } from '../../../../utils';
import Ripples from '../../Ripples';
import { Root } from './styles';

export interface Props {
  onClick?: (e: React.MouseEvent<HTMLDivElement>, element?: Item) => void;
  ripple?: boolean;
  customRippleBehavior?: boolean;
  value: any;
  id?: number;
  selected?: boolean;
}

export default class Item extends React.Component<Props, {}> {
  public static defaultProps = {
    customRippleBehavior: false,
    ripple: true,
  };

  private ripples: Ripples;

  public render() {
    const { children, selected } = this.props;

    const events = {
      onClick: this.onClick,
      ...getRippleEvents(this.props, () => this.ripples),
    };

    return (
      <Root selected={selected} {...events}>
        {children}
        <Ripples ref={(r) => (this.ripples = r)} color="#000" />
      </Root>
    );
  }

  private onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick(e, this);
    }
  }
}
