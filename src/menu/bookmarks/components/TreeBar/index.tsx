import React from 'react';

import Item from './Item';
import { Root } from './styles';

export default class TreeBar extends React.Component {
  public render() {
    return (
      <Root>
        <Item text="Home" />
        <Item text="Folder" />
        <Item text="Subfolder" />
      </Root>
    );
  }
}
