import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import { Content, Container, Scrollable } from '../Overlay/style';
import { NavigationDrawer } from '../NavigationDrawer';
import { SettingsSection } from '../../store/settings';
import { icons } from '../../constants';

const preventHiding = (e: any) => {
  e.stopPropagation();
};

const MenuItem = observer(
  ({ section, children }: { section: SettingsSection; children: any }) => (
    <NavigationDrawer.Item
      onClick={() => (store.settings.selectedSection = section)}
      selected={store.settings.selectedSection === section}
    >
      {children}
    </NavigationDrawer.Item>
  ),
);

export const Settings = observer(() => {
  return (
    <Container
      right
      onClick={preventHiding}
      visible={
        store.overlay.currentContent === 'history' && store.overlay.visible
      }
    >
      <Scrollable>
        <NavigationDrawer title="History" search>
          <MenuItem section="advanced">All</MenuItem>
          <div style={{ flex: 1 }} />
          <NavigationDrawer.Item icon={icons.trash}>
            Clear browsing data
          </NavigationDrawer.Item>
        </NavigationDrawer>
      </Scrollable>
    </Container>
  );
});
