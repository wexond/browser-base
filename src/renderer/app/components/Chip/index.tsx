import React from 'react';

import { Root } from './styles';
import { KeyBinding } from 'interfaces';

export type ChipEvent = (keyBinding?: KeyBinding) => void;

export interface Props {
  keyBinding?: KeyBinding;
  onClick?: ChipEvent;
}

export default class Chip extends React.Component<Props, {}> {
  private onClick = () => {
    const { onClick, keyBinding } = this.props;

    if (typeof onClick === 'function') {
      onClick(keyBinding);
    }
  };

  public render() {
    const { keyBinding, children } = this.props;

    return (
      <Root onClick={this.onClick}>
        {(keyBinding && keyBinding.key) || children}
      </Root>
    );
  }
}
