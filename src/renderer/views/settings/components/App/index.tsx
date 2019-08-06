import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { SettingsSection } from '../../store';
import { Appearance } from '../Appearance';
import { AddressBar } from '../AddressBar';
import { Privacy } from '../Privacy';
import store from '../../store';
import { NavigationDrawer } from '../NavigationDrawer';
import { Sections, Container } from './style';
import { Style } from '../../style';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

const GlobalStyle = createGlobalStyle`${Style}`;

const MenuItem = observer(
  ({ section, children }: { section: SettingsSection; children: any }) => (
    <NavigationDrawer.Item
      onClick={() => (store.selectedSection = section)}
      selected={store.selectedSection === section}
    >
      {children}
    </NavigationDrawer.Item>
  ),
);

export default observer(() => {
  const { selectedSection } = store;

  return (
    <ThemeProvider theme={store.theme}>
      <Container>
        <GlobalStyle />
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
          {selectedSection === 'privacy' && <Privacy />}
        </Sections>
      </Container>
    </ThemeProvider>
  );
});
