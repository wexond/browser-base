import React from 'react';
import { observer } from 'mobx-react';
import Menu from '../Menu';
import { deleteHistoryItem } from '../../../utils/history';
import store from '../../../store';
import { addFolder } from '../../../utils/bookmarks';
import Bookmarks from '../../bookmarks/Bookmarks';
import History from '../../history/History';
import About from '../../about/About';

const historyActions = {
  selectAll: () => {
    const { selectedHistoryItems, historyItems } = store;
    for (const item of historyItems) {
      selectedHistoryItems.push(item.id);
    }
  },
  deselectAll: () => {
    const { selectedHistoryItems } = store;
    for (let i = selectedHistoryItems.length - 1; i >= 0; i--) {
      selectedHistoryItems.splice(i, 1);
    }
  },
  deleteAllSelectedItems: () => {
    const { selectedHistoryItems } = store;
    for (let i = selectedHistoryItems.length - 1; i >= 0; i--) {
      const selectedItem = selectedHistoryItems[i];
      deleteHistoryItem(selectedItem);
      selectedHistoryItems.splice(i, 1);
    }
  },
};

const bookmarksActions = {
  addFolder: () => {
    addFolder('New folder', store.currentBookmarksTree);
  },
};

@observer
export default class GlobalMenu extends React.Component {
  public render() {
    const editingHistory = store.selectedHistoryItems.length > 0;
    const dictionary = store.dictionary;

    return (
      <Menu title="Wexond">
        <Menu.Item
          title={dictionary.history.title}
          icon={historyIcon}
          searchVisible
          content={<History />}
        >
          <Menu.Item title={dictionary.history.clearHistory} icon={clearIcon} />
          <Menu.Item
            title={dictionary.selecting.selectAll}
            visible={!editingHistory}
            icon={selectAllIcon}
            onClick={historyActions.selectAll}
          />
          <Menu.Item
            title={dictionary.selecting.deselectAll}
            visible={editingHistory}
            icon={closeIcon}
            onClick={historyActions.deselectAll}
          />
          <Menu.Item
            title={dictionary.selecting.deleteSelected}
            visible={editingHistory}
            icon={trashIcon}
            onClick={historyActions.deleteAllSelectedItems}
          />
        </Menu.Item>
        <Menu.Item
          title={dictionary.bookmarks.title}
          icon={bookmarksIcon}
          searchVisible
          content={<Bookmarks />}
        >
          <Menu.Item title={dictionary.selecting.selectAll} icon={selectAllIcon} />
          <Menu.Item title="New folder" icon={addFolderIcon} onClick={bookmarksActions.addFolder} />
        </Menu.Item>
        <Menu.Item
          title={dictionary.settings.title}
          icon={settingsIcon}
          searchVisible
          content={<div />}
        />
        <Menu.Item
          title={dictionary.extensions.title}
          icon={extensionsIcon}
          searchVisible
          content={<div />}
        />
        <Menu.Item
          title={dictionary.about.title}
          icon={aboutIcon}
          searchVisible={false}
          content={<About />}
        />
      </Menu>
    );
  }
}
