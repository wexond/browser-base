import React from 'react';

import { NavigationDrawerItems } from '../enums';

import TabGroups from '../../menu/tabGroups/components/TabGroups';
import History from '../../menu/history/components/History';
import About from '../../menu/about/components/About';

const tabGroupsIcon = require('../../shared/icons/tab-groups.svg');
const tabGroupsAddIcon = require('../../shared/icons/add.svg');
const tabGroupsLoadIcon = require('../../shared/icons/load.svg');
const tabGroupsSaveIcon = require('../../shared/icons/save.svg');
const historyIcon = require('../../shared/icons/history.svg');
const clearIcon = require('../../shared/icons/clear.svg');
const bookmarksIcon = require('../../shared/icons/bookmarks.svg');
const settingsIcon = require('../../shared/icons/settings.svg');
const extensionsIcon = require('../../shared/icons/extensions.svg');
const aboutIcon = require('../../shared/icons/info.svg');
const selectAllIcon = require('../../shared/icons/select-all.svg');

export default [
  {
    type: NavigationDrawerItems.TabGroups,
    label: 'Tab groups',
    icon: tabGroupsIcon,
    content: <TabGroups />,
    searchVisible: false,
    subItems: [
      {
        label: 'New group',
        icon: tabGroupsAddIcon,
      },
      {
        label: 'Load',
        icon: tabGroupsLoadIcon,
      },
      {
        label: 'Save',
        icon: tabGroupsSaveIcon,
      },
    ],
  },
  {
    type: NavigationDrawerItems.History,
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
      },
    ],
  },
  {
    type: NavigationDrawerItems.Bookmarks,
    label: 'Bookmarks',
    icon: bookmarksIcon,
    content: null,
    searchVisible: false,
    subItems: [],
  },
  {
    type: NavigationDrawerItems.Settings,
    label: 'Settings',
    icon: settingsIcon,
    content: null,
    searchVisible: false,
    subItems: [],
  },
  {
    type: NavigationDrawerItems.Extensions,
    label: 'Extensions',
    icon: extensionsIcon,
    content: null,
    searchVisible: false,
    subItems: [],
  },
  {
    type: NavigationDrawerItems.About,
    label: 'About',
    icon: aboutIcon,
    content: <About />,
    searchVisible: false,
    subItems: [],
  },
];
