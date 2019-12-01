import * as React from 'react';
import { NavigationDrawer } from '../NavigationDrawer';
import { observer } from 'mobx-react-lite';
import { icons } from '~/renderer/constants';
import { WEBUI_BASE_URL, WEBUI_URL_SUFFIX } from '~/constants/files';

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
      onClick={() =>
        (window.location.href = `${WEBUI_BASE_URL}${name}${WEBUI_URL_SUFFIX}`)
      }
      selected={window.location.href.startsWith(
        `${WEBUI_BASE_URL}${name}${WEBUI_URL_SUFFIX}`,
      )}
      icon={icon}
    >
      {children}
    </NavigationDrawer.Item>
  ),
);

export const GlobalNavigationDrawer = () => {
  return (
    <NavigationDrawer dense title="">
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
