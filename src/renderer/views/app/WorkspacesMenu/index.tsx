import { observer } from 'mobx-react';
import React from 'react';
import Add from './Add';
import Item from './Item';
import { Root, ItemsContainer, Dark } from './styles';
import store from '../../../store';
import Workspace from '../../../models/workspace';

@observer
export default class Workspaces extends React.Component<{}, {}> {
  onClick = () => {
    store.workspacesMenuVisible = false;
  };

  // TODO: A dialog with workspace name
  addNew = () => {
    const workspace: Workspace = new Workspace();

    store.workspaces.push(workspace);
    store.selectedWorkspace = store.workspaces[store.workspaces.length - 1].id;
  };

  public render() {
    return (
      <React.Fragment>
        <Root visible={store.workspacesMenuVisible} onClick={this.onClick}>
          <ItemsContainer visible={store.workspacesMenuVisible}>
            {store.workspaces.map((workspace: Workspace) => (
              <Item workspace={workspace} key={workspace.id} />
            ))}
            <Add onClick={this.addNew} />
          </ItemsContainer>
          <Dark />
        </Root>
      </React.Fragment>
    );
  }
}
