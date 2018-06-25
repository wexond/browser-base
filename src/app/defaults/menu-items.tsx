import React from 'react';

import { MenuItems } from '../enums';

import History from '../../menu/history/components/History';
import About from '../../menu/about/components/About';

import HistoryStore from '../../menu/history/store';

import { deleteHistoryItem } from '../../menu/history/utils';

const historyIcon = require('../../shared/icons/history.svg');
const clearIcon = require('../../shared/icons/clear.svg');
const bookmarksIcon = require('../../shared/icons/bookmarks.svg');
const settingsIcon = require('../../shared/icons/settings.svg');
const extensionsIcon = require('../../shared/icons/extensions.svg');
const aboutIcon = require('../../shared/icons/info.svg');
const selectAllIcon = require('../../shared/icons/select-all.svg');
const closeIcon = require('../../shared/icons/close.svg');
const trashIcon = require('../../shared/icons/delete.svg');

const history = {
  onSelectAllClick: () => {
    const { selectedItems, sections } = HistoryStore;
    for (const section of sections) {
      for (const item of section.items) {
        item.selected = true;
        selectedItems.push(item);
      }
    }
  },
  onDeselectAllClick: () => {
    const { selectedItems } = HistoryStore;
    for (let i = selectedItems.length - 1; i >= 0; i--) {
      selectedItems[i].selected = false;
      selectedItems.splice(i, 1);
    }
  },
  onDeleteSelectedClick: () => {
    const { selectedItems, sections } = HistoryStore;
    for (let i = selectedItems.length - 1; i >= 0; i--) {
      const selectedItem = selectedItems[i];
      deleteHistoryItem(selectedItem.id);
      selectedItems.splice(i, 1);
    }
  },
};

export default [
  {
    type: MenuItems.History,
    label: 'History',
    icon: historyIcon,
    content: <History />,
    searchVisible: true,
    subItems: [
      {
        label: 'Clear browsing history',
        icon: clearIcon,
      },
      {
        label: 'Select all',
        icon: selectAllIcon,
        onClick: history.onSelectAllClick,
        visible: true,
      },
      {
        label: 'Deselect all',
        icon: closeIcon,
        onClick: history.onDeselectAllClick,
        visible: false,
      },
      {
        label: 'Delete selected items',
        icon: trashIcon,
        onClick: history.onDeleteSelectedClick,
        visible: false,
      },
    ],
  },
  {
    type: MenuItems.Bookmarks,
    label: 'Bookmarks',
    icon: bookmarksIcon,
    content: null,
    searchVisible: false,
    subItems: [],
  },
  {
    type: MenuItems.Settings,
    label: 'Settings',
    icon: settingsIcon,
    content: null,
    searchVisible: false,
    subItems: [],
  },
  {
    type: MenuItems.Extensions,
    label: 'Extensions',
    icon: extensionsIcon,
    content: null,
    searchVisible: false,
    subItems: [],
  },
  {
    type: MenuItems.About,
    label: 'About',
    icon: aboutIcon,
    content: <About />,
    searchVisible: false,
    subItems: [],
  },
];
