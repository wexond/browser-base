import * as React from 'react';
import { observer } from 'mobx-react';

import { SettingsSection } from '~/renderer/views/app/store/settings';
import { NavigationDrawer } from '../../components/NavigationDrawer';
import store from '~/renderer/views/app/store';
import { Container, Scrollable2, Sections } from '../../style';
import { Appearance } from './views';

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
  const { selectedSection } = store.settings;

  return (
    <Container
      right
      onClick={preventHiding}
      visible={
        store.overlay.currentContent === 'settings' && store.overlay.visible
      }
    >
      <Scrollable2>
        <NavigationDrawer title="Settings" search>
          <MenuItem section="appearance">Appearance</MenuItem>
          <MenuItem section="autofill">Autofill</MenuItem>
          <MenuItem section="addressbar">Addressbar</MenuItem>
          <MenuItem section="privacy">Privacy and services</MenuItem>
          <MenuItem section="permissions">Permissions</MenuItem>
          <MenuItem section="startup">On startup</MenuItem>
          <MenuItem section="language">Language</MenuItem>
          <MenuItem section="shortcuts">Keyboard shortcuts</MenuItem>
          <MenuItem section="downloads">Downloads</MenuItem>
          <MenuItem section="system">System</MenuItem>
        </NavigationDrawer>
        <Sections style={{ paddingTop: 32 }}>
          {selectedSection === 'appearance' && <Appearance />}
        </Sections>
      </Scrollable2>
    </Container>
  );
});
