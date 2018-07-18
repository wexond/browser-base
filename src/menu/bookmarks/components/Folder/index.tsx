import React from 'react';
import Store from '../../store';

import { Root, Icon, Label } from './styles';

interface Props {
  data: any;
}

export default class Folder extends React.Component<Props, {}> {
  onClick = () => {
    const { data } = this.props;

    Store.selected = data;
    Store.updatePath();
  };

  public render() {
    const { data } = this.props;

    return (
      <Root onClick={this.onClick}>
        <Icon />
        <Label>{data.title}</Label>
      </Root>
    );
  }
}
