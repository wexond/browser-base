import React from 'react';
import Store from '../../../store';

import { Root, Icon } from './styles';

export interface IProps {
  data: any;
  title: string;
}

export default class Item extends React.Component<IProps, {}> {
  onClick = () => {
    const { data } = this.props;

    Store.selected = data;
    Store.updatePath();
  };

  public render() {
    const { title } = this.props;

    return (
      <Root onClick={this.onClick}>
        {title}
        <Icon className="icon" />
      </Root>
    );
  }
}
