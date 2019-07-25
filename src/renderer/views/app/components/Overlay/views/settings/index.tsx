import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '~/renderer/views/app/store';
import { SettingsSection } from '~/renderer/views/app/store/settings';
import { NavigationDrawer } from '../../components/NavigationDrawer';
import { Appearance } from './Appearance';
import { Container } from '../..';
import { Scrollable2, Sections } from '../../style';
import { AddressBar } from './AddressBar';

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
  const { selectedSection } = store.settings;

  return (
    <Container content="settings" right>
      <Scrollable2>
        <NavigationDrawer title="Settings" search>
          <MenuItem section="appearance">Appearance</MenuItem>
          <MenuItem section="startup">On startup</MenuItem>
          <MenuItem section="address-bar">Address bar</MenuItem>
          <MenuItem section="privacy">Privacy</MenuItem>
          <MenuItem section="permissions">Site permissions</MenuItem>
          <MenuItem section="downloads">Downloads</MenuItem>
          <MenuItem section="language">Languages</MenuItem>
          <MenuItem section="shortcuts">Keyboard shortcuts</MenuItem>
          <MenuItem section="system">System</MenuItem>
        </NavigationDrawer>
        <Sections style={{ paddingTop: 48 }}>
          {selectedSection === 'appearance' && <Appearance />}
          {selectedSection === 'address-bar' && <AddressBar />}
        </Sections>
      </Scrollable2>
    </Container>
  );
});
