import React from 'react';
import { observer } from 'mobx-react';

import NavigationDrawer from '@/components/NavigationDrawer';
import { icons } from '@/constants/renderer';
import store from '@bookmarks/store';
import TreeBar from '../TreeBar';
import Item from '../Item';
import { StyledApp, PageContainer, Content } from './styles';
import { Bookmark } from '@/interfaces';

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
  addFolder: () => {
    // TODO
    const a: Bookmark = {
      _id: 'abcedfghi',
      parent: null,
      title: 'A folder',
      type: 'folder',
    };

    const aa: Bookmark = {
      _id: 'abcedfghib',
      parent: 'abcedfghi',
      title: 'AA folder',
      type: 'folder',
    };

    store.bookmarks.push(a);
    store.bookmarks.push(aa);
  },
};

@observer
export default class App extends React.Component {
  componentDidMount() {
    global.onIpcReceived.addListener((name: string, data: any) => {
      if (name === 'bookmarks-add') {
        if (data[0] != null) {
          store.bookmarks = Object.values(data);
        } else {
          store.bookmarks.push(data);
        }

        store.goToFolder(null);
      } else if (name === 'bookmarks-remove') {
        store.bookmarks = store.bookmarks.filter(x => x._id !== data._id);
      }
    });
  }

  public render() {
    const items = store.bookmarks.filter(x => x.parent === store.currentTree);
    const selected = store.selectedItems.length > 0;

    return (
      <StyledApp>
        <NavigationDrawer title="History" onSearch={actions.search} search>
          {(!selected && (
            <React.Fragment>
              <NavigationDrawer.Item title="Add" icon={icons.add} />
              <NavigationDrawer.Item
                title="New folder"
                icon={icons.addFolder}
                onClick={actions.addFolder}
              />
              <NavigationDrawer.Divider />
              <NavigationDrawer.Item
                title="Select all"
                icon={icons.selectAll}
                onClick={actions.selectAll}
              />
            </React.Fragment>
          )) || (
            <React.Fragment>
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
            </React.Fragment>
          )}
        </NavigationDrawer>
        <PageContainer>
          <TreeBar />
          <Content>
            {items.map((data, key) => {
              return <Item data={data} key={key} />;
            })}
          </Content>
        </PageContainer>
      </StyledApp>
    );
  }
}
