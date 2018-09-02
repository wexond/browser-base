import { observer } from 'mobx-react';
import React from 'react';

import store from '@app/store';
import TabGroupItem from '../TabGroupItem';
import TabGroupAdd from '../TabGroupAdd';
import { Dark, ItemsContainer, Root } from './styles';

@observer
export default class TabGroupsMenu extends React.Component<{}, {}> {
  public onClick = () => {
    store.tabsStore.menuVisible = false;
  };

  public addNew = () => {
    store.tabsStore.addGroup();
  };

  public render() {
    const { tabsStore } = store;

    return (
      <React.Fragment>
        <Root visible={tabsStore.menuVisible} onClick={this.onClick}>
          <ItemsContainer visible={tabsStore.menuVisible}>
            {tabsStore.groups.map(item => (
              <TabGroupItem data={item} key={item.id} />
            ))}
            <TabGroupAdd onClick={this.addNew} />
          </ItemsContainer>
          <Dark />
        </Root>
      </React.Fragment>
    );
  }
}
