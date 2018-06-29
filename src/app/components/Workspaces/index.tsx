import { observer } from 'mobx-react';
import React, { Component } from 'react';
import Item from './Item';
import Store from '../../store';
import { Root, ItemsContainer, Dark } from './styles';
import Workspace from '../../models/workspace';

@observer
export default class Workspaces extends Component<{}, {}> {
  onDarkClick = () => {
    Store.workspaces.visible = false;
  };

  public render() {
    const { visible, selected, list } = Store.workspaces;
    const icons = ['https://assets-cdn.github.com/favicon.ico'];

    return (
      <React.Fragment>
        <Root visible={visible}>
          <ItemsContainer>
            {list.map((workspace: Workspace) => (
              <Item
                icons={workspace.getIcons()}
                label={workspace.name}
                selected={selected === workspace.id}
                key={workspace.id}
              />
            ))}
          </ItemsContainer>
          <Dark onClick={this.onDarkClick} />
        </Root>
      </React.Fragment>
    );
  }
}
