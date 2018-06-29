import { observer } from 'mobx-react';
import React, { Component } from 'react';
import Item from './Item';
import Store from '../../store';
import { Root, ItemsContainer, Dark } from './styles';
import Workspace from '../../models/workspace';

@observer
export default class Workspaces extends Component<{}, {}> {
  hide = () => {
    Store.workspaces.visible = false;
  };

  public render() {
    const { visible, selected, list } = Store.workspaces;

    return (
      <React.Fragment>
        <Root visible={visible} onClick={this.hide}>
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
          <Dark />
        </Root>
      </React.Fragment>
    );
  }
}
