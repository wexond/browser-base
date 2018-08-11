import React from 'react';

import { KeyBinding } from '../../../../interfaces';
import { Root } from './styles';

export type KeyEvent = (element?: Key) => void;

export interface Props {
  keyBinding?: KeyBinding;
  onClick?: KeyEvent;
}

export default class Key extends React.Component<Props, {}> {
  private onClick = () => {
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick(this);
    }
  };

  public render() {
    const { keyBinding, children } = this.props;

    return <Root onClick={this.onClick}>{(keyBinding && keyBinding.key) || children}</Root>;
  }
}
