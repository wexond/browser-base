import { observer } from 'mobx-React';
import React from 'react';
import { createWorkspace } from '../../../../utils';
import store from '../../../store';
import Add from './Add';
import Item from './Item';
import { Dark, ItemsContainer, Root } from './styles';

@observer
export default class Workspaces extends React.Component<{}, {}> {
  public onClick = () => {
    store.workspacesMenuVisible = false;
  }

  // TODO: A dialog with workspace name
  public addNew = () => {
    createWorkspace();
  }

  public render() {
    return (
      <React.Fragment>
        <Root visible={store.workspacesMenuVisible} onClick={this.onClick}>
          <ItemsContainer visible={store.workspacesMenuVisible}>
            {store.workspaces.map((workspace) => (
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
