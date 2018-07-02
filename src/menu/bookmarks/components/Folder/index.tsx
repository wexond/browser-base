import React from 'react';

import { Root, Icon, Label } from './styles';

export default class Folder extends React.Component {
  public render() {
    return (
      <Root>
        <Icon />
        <Label>Folder</Label>
      </Root>
    );
  }
}
