import React from 'react';

import { Root, Icon } from './styles';

export interface IProps {
  text: string;
}

export default class Item extends React.Component<IProps, {}> {
  public render() {
    const { text } = this.props;

    return (
      <Root>
        {text}
        <Icon className="icon" />
      </Root>
    );
  }
}
