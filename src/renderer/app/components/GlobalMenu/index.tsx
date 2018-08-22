import React from 'react';
import { observer } from 'mobx-react';

import Menu from '../Menu';
import store from '@app/store';
import { icons } from '~/defaults';
import Bookmarks from '../Bookmarks';
import KeyboardShortcuts from '../KeyboardShortcuts';
import About from '../About';
import History from '../History';
import { Dictionary } from '~/interfaces';

const historyActions = {
  selectAll: () => {
    const { selectedItems, historyItems } = store.historyStore;
    for (const item of historyItems) {
      selectedItems.push(item._id);
    }
  },
  deselectAll: () => {
    const { selectedItems } = store.historyStore;
    for (let i = selectedItems.length - 1; i >= 0; i--) {
      selectedItems.splice(i, 1);
    }
  },
  deleteAllSelectedItems: () => {
    const { selectedItems } = store.historyStore;
    for (let i = selectedItems.length - 1; i >= 0; i--) {
      const selectedItem = selectedItems[i];
      store.historyStore.removeItem(selectedItem);
      selectedItems.splice(i, 1);
    }
  },
};

const bookmarksActions = {
  addFolder: () => {
    const { bookmarksStore } = store;
    bookmarksStore.addFolder('New folder', bookmarksStore.currentTree);
  },
};

@observer
export default class GlobalMenu extends React.Component {
  public render() {
    const editingHistory = store.historyStore.selectedItems.length > 0;
    const dictionary: Dictionary = store.dictionary;

    return (
      <Menu title="Wexond">
        <Menu.Item
          title={dictionary.history.title}
          icon={icons.history}
          searchVisible
        >
          <Menu.Item
            title={dictionary.history.clearHistory}
            icon={icons.clear}
          />
          <Menu.Item
            title={dictionary.selecting.selectAll}
            visible={!editingHistory}
            icon={icons.selectAll}
            onClick={historyActions.selectAll}
          />
          <Menu.Item
            title={dictionary.selecting.deselectAll}
            visible={editingHistory}
            icon={icons.close}
            onClick={historyActions.deselectAll}
          />
          <Menu.Item
            title={dictionary.selecting.deleteSelected}
            visible={editingHistory}
            icon={icons.delete}
            onClick={historyActions.deleteAllSelectedItems}
          />
        </Menu.Item>
        <Menu.Item
          title={dictionary.bookmarks.title}
          icon={icons.bookmarks}
          searchVisible
        >
          <Menu.Item
            title={dictionary.selecting.selectAll}
            icon={icons.selectAll}
          />
          <Menu.Item
            title={dictionary.bookmarks.newFolder}
            icon={icons.addFolder}
            onClick={bookmarksActions.addFolder}
          />
        </Menu.Item>
        <Menu.Item
          title={dictionary.settings.title}
          icon={icons.settings}
          searchVisible
        />
        <Menu.Item
          title={dictionary.keyboardShortcuts.title}
          icon={icons.keyboardShortcuts}
          searchVisible
        />
        <Menu.Item
          title={dictionary.extensions.title}
          icon={icons.extensions}
          searchVisible
        />
        <Menu.Item
          title={dictionary.about.title}
          icon={icons.info}
          searchVisible={false}
        />

        <History />
        <Bookmarks />
        <div />
        <KeyboardShortcuts />
        <div />
        <About />
      </Menu>
    );
  }
}
