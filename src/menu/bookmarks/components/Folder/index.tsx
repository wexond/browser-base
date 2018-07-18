import React from 'react';

import { Root, Icon, Label } from './styles';

interface Props {
  data: any;
}

export default class Folder extends React.Component<Props, {}> {
  public render() {
    const { data } = this.props;

    return (
      <Root>
        <Icon />
        <Label>{data.title}</Label>
      </Root>
    );
  }
}
