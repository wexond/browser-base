import * as React from 'react';
import { NavigationDrawer } from '../NavigationDrawer';
import { observer } from 'mobx-react-lite';
import { icons } from '~/renderer/constants';

const MenuItem = observer(
  ({
    name,
    children,
    icon,
  }: {
    name: string;
    children: any;
    icon?: string;
  }) => (
    <NavigationDrawer.Item
      onClick={() => (window.location.href = `wexond://${name}`)}
      selected={window.location.href.startsWith(`wexond://${name}`)}
      icon={icon}
    >
      {children}
    </NavigationDrawer.Item>
  ),
);

export const GlobalNavigationDrawer = () => {
  return (
    <NavigationDrawer dense title="">
      <MenuItem name="newtab" icon={icons.dashboard}>
        Home
      </MenuItem>
      <MenuItem name="settings" icon={icons.settings}>
        Settings
      </MenuItem>
      <MenuItem name="history" icon={icons.history}>
        History
      </MenuItem>
      <MenuItem name="bookmarks" icon={icons.bookmarks}>
        Bookmarks
      </MenuItem>
      <MenuItem name="downloads" icon={icons.download}>
        Downloads
      </MenuItem>
      <MenuItem name="extensions" icon={icons.extensions}>
        Extensions
      </MenuItem>
    </NavigationDrawer>
  );
};
