import * as React from 'react';
import { NavigationDrawer } from '../NavigationDrawer';
import { MenuButton } from '../NavigationDrawer/style';
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

export const GlobalNavigationDrawer = ({
  translucent,
}: {
  translucent: boolean;
}) => {
  const [toggled, setToggled] = React.useState(false);

  return (
    <NavigationDrawer
      translucent={translucent}
      toggled={toggled}
      dense
      title=""
    >
      <MenuButton onClick={() => setToggled(!toggled)} />
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
