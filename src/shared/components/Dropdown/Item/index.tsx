import * as React from 'react';

import { Root } from './styles';

export interface IProps {
  onClick?: (e: React.MouseEvent<HTMLDivElement>, element?: Item) => void;
  selectedItem?: Item; // eslint-disable-line
}

export default class Item extends React.Component<IProps, {}> {
  private onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick(e, this);
    }
  };

  public render() {
    const { children, selectedItem } = this.props;
    const selected = selectedItem === this;

    return (
      <Root onClick={this.onClick} selected={selected}>
        {children}
      </Root>
    );
  }
}
