import React from 'react';
import { observer } from 'mobx-react';

import NavigationDrawer from '@/components/NavigationDrawer';
import { icons } from '@/constants/renderer';
import store from '@bookmarks/store';
import TreeBar from '../TreeBar';
import Item from '../Item';
import { StyledApp, PageContainer, Items } from './styles';
import Dragged from '@bookmarks/components/Dragged';
import { DRAG_ELEMENT_WIDTH } from '@/constants/bookmarks';
import { moveItem } from '@/utils/arrays';

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
    global.wexondPages.bookmarks.addFolder('New folder', store.currentTree);
  },
};

@observer
export default class App extends React.Component {
  componentDidMount() {
    global.onIpcReceived.addListener((name: string, data: any) => {
      if (name === 'bookmarks-add') {
        if (store.bookmarks.length === 0) {
          store.goToFolder(null);
        }

        if (data[0] != null) {
          for (const item of Object.values(data)) {
            store.bookmarks.push(item);
          }
        } else {
          store.bookmarks.push(data);
        }
      } else if (name === 'bookmarks-edit') {
        const index = store.bookmarks.findIndex(x => x._id === data._id);
        store.bookmarks[index] = data;
      } else if (name === 'bookmarks-delete') {
        store.bookmarks = store.bookmarks.filter(x => x._id !== data._id);
      }
    });

    window.addEventListener('mousemove', this.onWindowMouseMove);
    window.addEventListener('mouseup', this.onWindowMouseUp);
  }

  public onWindowMouseMove = (e: MouseEvent) => {
    if (!store.dragged) return;
    if (!store.draggedVisible) store.draggedVisible = true;

    store.mousePos = {
      x: e.clientX - DRAG_ELEMENT_WIDTH / 2,
      y: e.clientY,
    };
  };

  public onWindowMouseUp = (e: MouseEvent) => {
    if (!store.dragged || store.hovered == null) return;

    const oldIndex = store.bookmarks.indexOf(store.dragged);
    const newIndex = store.bookmarks.indexOf(store.hovered);

    moveItem(store.bookmarks, oldIndex, newIndex);

    store.dragged = null;
    store.draggedVisible = false;
    store.hovered = null;
  };

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
        <TreeBar />
        <PageContainer>
          {items.length > 0 && (
            <Items>
              {items.map((data, key) => {
                return <Item data={data} key={key} />;
              })}
            </Items>
          )}
        </PageContainer>
        {store.draggedVisible && <Dragged />}
      </StyledApp>
    );
  }
}
