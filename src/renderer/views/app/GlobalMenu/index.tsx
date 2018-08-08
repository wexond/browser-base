import React from "react";
import { observer } from "mobx-react";

import Menu from "../Menu";
import store from "../../../store";
import Bookmarks from "../../bookmarks/Bookmarks";
import History from "../../history/History";
import About from "../../about/About";
import KeysManager from "../../keys-manager/KeysManager";
import { deleteHistoryItem, addFolder } from "../../../../utils";
import { icons } from "../../../../defaults";

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
  }
};

const bookmarksActions = {
  addFolder: () => {
    addFolder("New folder", store.currentBookmarksTree);
  }
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
            title="New folder"
            icon={icons.addFolder}
            onClick={bookmarksActions.addFolder}
          />
        </Menu.Item>
        <Menu.Item
          title={dictionary.settings.title}
          icon={icons.settings}
          searchVisible
        />
        <Menu.Item title="Keys manager" icon={icons.keysManager} />
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
        <KeysManager />
        <div />
        <About />
      </Menu>
    );
  }
}
