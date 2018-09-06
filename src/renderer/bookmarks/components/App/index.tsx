import React from 'react';
import { observer } from 'mobx-react';

import NavigationDrawer from '@/components/NavigationDrawer';
import { icons } from '@/constants/renderer';
import store from '@bookmarks/store';
import TreeBar from '../TreeBar';
import Item from '../Item';
import { StyledApp, PageContainer } from './styles';

declare const global: any;

const actions = {
  selectAll: () => {
    console.log('select all');
  },
  deselectAll: () => {
    console.log('deselect all');
  },
  deleteAllSelected: () => {
    console.log('delete all selected');
  },
  search: (str: string) => {
    store.search(str.toLowerCase());
  },
};

@observer
export default class App extends React.Component {
  componentDidMount() {
    global.onIpcReceived.addListener((name: string, data: any) => {
      if (name === 'bookmarks-add') {
        store.bookmarks = [...store.bookmarks, ...Object.values(data)];
      }
    });
  }

  public render() {
    return (
      <StyledApp>
        <NavigationDrawer title="History" onSearch={actions.search} search>
          <NavigationDrawer.Item
            title="Select all"
            icon={icons.selectAll}
            onClick={actions.selectAll}
          />
          <NavigationDrawer.Item
            title="Deselect"
            icon={icons.close}
            onClick={actions.deselectAll}
          />
          <NavigationDrawer.Item
            title="Delete"
            icon={icons.delete}
            onClick={actions.deleteAllSelected}
          />
        </NavigationDrawer>
        <PageContainer>
          <TreeBar />
          {store.bookmarks.map((data, key) => {
            // Temporary for testing
            return <Item data={data} key={key} />;
          })}
        </PageContainer>
      </StyledApp>
    );
  }
}
