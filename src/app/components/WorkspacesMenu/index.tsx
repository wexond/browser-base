import { observer } from 'mobx-react';
import React, { Component } from 'react';
import Store from '../../store';
import Workspace from '../../models/workspace';
import Add from './Add';
import Item from './Item';
import { Root, ItemsContainer, Dark } from './styles';

@observer
export default class Workspaces extends Component<{}, {}> {
  hide = () => {
    Store.workspaces.visible = false;
  };

  // TODO: A dialog with workspace name
  addNew = () => {
    const workspace: Workspace = new Workspace();

    Store.workspaces.list.push(workspace);
    Store.workspaces.selected = Store.workspaces.list[Store.workspaces.list.length - 1].id;
  };

  public render() {
    const { visible, selected, list } = Store.workspaces;

    return (
      <React.Fragment>
        <Root visible={visible} onClick={this.hide}>
          <ItemsContainer visible={visible}>
            {list.map((workspace: Workspace) => <Item workspace={workspace} key={workspace.id} />)}
            <Add onClick={this.addNew} />
          </ItemsContainer>
          <Dark />
        </Root>
      </React.Fragment>
    );
  }
}
