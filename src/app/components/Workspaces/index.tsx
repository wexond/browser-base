import { observer } from 'mobx-react';
import React, { Component } from 'react';
import Item from './Item';
import Store from '../../store';
import { Root, ItemsContainer, Dark } from './styles';

@observer
export default class Workspaces extends Component<{}, {}> {
  onDarkClick = () => {
    Store.workspaces.visible = false;
  };

  public render() {
    const { visible } = Store.workspaces;
    const icons = ['https://assets-cdn.github.com/favicon.ico'];

    return (
      <React.Fragment>
        <Root visible={visible}>
          <ItemsContainer>
            <Item icons={icons} label="Work" selected />
            <Item icons={icons} label="Fun" />
          </ItemsContainer>
          <Dark onClick={this.onDarkClick} />
        </Root>
      </React.Fragment>
    );
  }
}
