import React from 'react';

import { Icon, Root } from './styles';

export interface Props {
  onClick?: (e?: React.SyntheticEvent<HTMLDivElement>) => void;
}

export default class extends React.Component<Props, {}> {
  public render() {
    const { onClick } = this.props;

    return (
      <Root onClick={onClick}>
        <Icon className="icon" />
      </Root>
    );
  }
}
