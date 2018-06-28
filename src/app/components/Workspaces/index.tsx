import React from 'react';

import Item from './Item';

import { Root, ItemsContainer } from './styles';

export default class extends React.Component<{}, {}> {
  public render() {
    const icons = ['https://assets-cdn.github.com/favicon.ico'];

    return (
      <Root>
        <ItemsContainer>
          <Item icons={icons} label="Work" />
          <Item icons={icons} label="Fun" />
        </ItemsContainer>
      </Root>
    );
  }
}
