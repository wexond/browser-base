import { observer } from 'mobx-react';
import React, { Component } from 'react';
import Item from './Item';
import Store from '../../store';
import { ItemsContainer, Dark } from './styles';

@observer
export default class Workspaces extends Component<{}, {}> {
  public render() {
    const { visible } = Store.workspaces;
    const icons = ['https://assets-cdn.github.com/favicon.ico'];

    return (
      <React.Fragment>
        <ItemsContainer>
          <Item icons={icons} label="Work" selected />
          <Item icons={icons} label="Fun" />
        </ItemsContainer>
        <Dark />
      </React.Fragment>
    );
  }
}
