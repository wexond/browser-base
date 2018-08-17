import { observer } from 'mobx-react';
import React from 'react';

import store from '../../../store';
import TabGroupAdd from '../TabGroupAdd';
import Item from '../Item';
import { Dark, ItemsContainer, Root } from './styles';

@observer
export default class Workspaces extends React.Component<{}, {}> {
  public onClick = () => {
    store.tabGroupsStore.menuVisible = true;
  };

  public addNew = () => {
    // createWorkspace();
  };

  public render() {
    const tabGroupsStore = store.tabGroupsStore;

    return (
      <React.Fragment>
        <Root visible={tabGroupsStore.menuVisible} onClick={this.onClick}>
          <ItemsContainer visible={tabGroupsStore.menuVisible}>
            {tabGroupsStore.tabGroups.map((workspace, key) => (
              <Item workspace={workspace} key={key} />
            ))}
            <TabGroupAdd onClick={this.addNew} />
          </ItemsContainer>
          <Dark />
        </Root>
      </React.Fragment>
    );
  }
}
