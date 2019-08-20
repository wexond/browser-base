import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '~/renderer/views/app/store';
import { SettingsSection } from '~/renderer/views/app/store/settings';
import { NavigationDrawer } from '../../components/NavigationDrawer';
import { Appearance } from './Appearance';
import { Container } from '../..';
import { Scrollable2, Sections } from '../../style';
import { AddressBar } from './AddressBar';
import { Privacy } from './Privacy';
import { Autofill } from './Autofill';
import { icons } from '~/renderer/constants';
import { OnStartup } from './startup';

const MenuItem = observer(
  ({
    section,
    children,
    icon,
  }: {
    section: SettingsSection;
    children: any;
    icon?: string;
  }) => (
    <NavigationDrawer.Item
      onClick={() => (store.settings.selectedSection = section)}
      selected={store.settings.selectedSection === section}
      icon={icon}
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
          <MenuItem icon={icons.palette} section="appearance">
            Appearance
          </MenuItem>
          <MenuItem icon={icons.autofill} section="autofill">
            Autofill
          </MenuItem>
          <MenuItem icon={icons.power} section="startup">On startup</MenuItem>
          <MenuItem icon={icons.search} section="address-bar">
            Address bar
          </MenuItem>
          {/* <MenuItem section="privacy">Privacy</MenuItem> */}
          {/* <MenuItem section="permissions">Site permissions</MenuItem> */}
          {/* <MenuItem section="downloads">Downloads</MenuItem> */}
          {/* <MenuItem section="language">Languages</MenuItem> */}
          {/* <MenuItem section="shortcuts">Keyboard shortcuts</MenuItem> */}
          {/* <MenuItem section="system">System</MenuItem> */}
        </NavigationDrawer>
        <Sections style={{ paddingTop: 48 }}>
          {selectedSection === 'appearance' && <Appearance />}
          {selectedSection === 'autofill' && <Autofill />}
          {selectedSection === 'address-bar' && <AddressBar />}
          {selectedSection === 'startup' && <OnStartup />}
          {selectedSection === 'privacy' && <Privacy />}
        </Sections>
      </Scrollable2>
    </Container>
  );
});
