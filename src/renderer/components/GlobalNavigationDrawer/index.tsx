import * as React from 'react';
import { NavigationDrawer } from '../NavigationDrawer';
import { observer } from 'mobx-react-lite';
import {
  ICON_SETTINGS,
  ICON_HISTORY,
  ICON_BOOKMARKS,
  ICON_EXTENSIONS,
  ICON_DOWNLOAD,
} from '~/renderer/constants/icons';
import { getWebUIURL } from '~/common/webui';

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
      onClick={() => (window.location.href = getWebUIURL(name))}
      selected={window.location.href.startsWith(getWebUIURL(name))}
      icon={icon}
    >
      {children}
    </NavigationDrawer.Item>
  ),
);

export const GlobalNavigationDrawer = () => {
  return (
    <NavigationDrawer dense title="">
      <MenuItem name="settings" icon={ICON_SETTINGS}>
        Settings
      </MenuItem>
      <MenuItem name="history" icon={ICON_HISTORY}>
        History
      </MenuItem>
      <MenuItem name="bookmarks" icon={ICON_BOOKMARKS}>
        Bookmarks
      </MenuItem>
      {/* <MenuItem name="downloads" icon={ICON_DOWNLOAD}>
        Downloads
      </MenuItem>
      <MenuItem name="extensions" icon={ICON_EXTENSIONS}>
        Extensions
      </MenuItem> */}
    </NavigationDrawer>
  );
};
