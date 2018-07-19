import React from 'react';
import { observer } from 'mobx-react';
import GlobalStore from '../../../global-store';
import HistoryStore from '../../../menu/history/store';
import Menu from '../Menu';
import History from '../../../menu/history/components/History';
import About from '../../../menu/about/components/About';
import Bookmarks from '../../../menu/bookmarks/components/Bookmarks';
import { deleteHistoryItem } from '../../../menu/history/utils';

const historyIcon = require('../../../shared/icons/history.svg');
const clearIcon = require('../../../shared/icons/clear.svg');
const bookmarksIcon = require('../../../shared/icons/bookmarks.svg');
const settingsIcon = require('../../../shared/icons/settings.svg');
const extensionsIcon = require('../../../shared/icons/extensions.svg');
const aboutIcon = require('../../../shared/icons/info.svg');
const selectAllIcon = require('../../../shared/icons/select-all.svg');
const closeIcon = require('../../../shared/icons/close.svg');
const trashIcon = require('../../../shared/icons/delete.svg');
const addIcon = require('../../../shared/icons/add.svg');
const addFolderIcon = require('../../../shared/icons/add-folder.svg');

const historyActions = {
  selectAll: () => {
    const { selectedItems, sections } = HistoryStore;
    for (const section of sections) {
      for (const item of section.items) {
        item.selected = true;
        selectedItems.push(item);
      }
    }
  },
  deselectAll: () => {
    const { selectedItems } = HistoryStore;
    for (let i = selectedItems.length - 1; i >= 0; i--) {
      selectedItems[i].selected = false;
      selectedItems.splice(i, 1);
    }
  },
  deleteAllSelectedItems: () => {
    const { selectedItems, sections } = HistoryStore;
    for (let i = selectedItems.length - 1; i >= 0; i--) {
      const selectedItem = selectedItems[i];
      deleteHistoryItem(selectedItem.id);
      selectedItems.splice(i, 1);
    }
  },
};

@observer
export default class GlobalMenu extends React.Component {
  public render() {
    const editingHistory = HistoryStore.selectedItems.length > 0;
    const dictionary = GlobalStore.dictionary;

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
          <Menu.Item title="Add" icon={addIcon} />
          <Menu.Item title="New folder" icon={addFolderIcon} />
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
