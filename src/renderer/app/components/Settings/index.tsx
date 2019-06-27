import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import { Container, Scrollable, Content } from '../Overlay/style';
import { NavigationDrawer } from '../NavigationDrawer';
import { SettingsSection } from '../../store/settings';
import { Sections } from './styles';
import { Textfield } from '~/renderer/components/Textfield';

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
        store.overlay.currentContent === 'settings' && store.overlay.visible
      }
    >
      <Scrollable>
        <NavigationDrawer title="Settings" search>
          <MenuItem section="general">General</MenuItem>
          <MenuItem section="appearance">Appearance</MenuItem>
          <MenuItem section="autofill">Autofill</MenuItem>
          <MenuItem section="search-engine">Search engine</MenuItem>
          <MenuItem section="startup">On startup</MenuItem>
          <MenuItem section="language">Language</MenuItem>
          <MenuItem section="weather">Weather</MenuItem>
          <MenuItem section="shortcuts">Keyboard shortcuts</MenuItem>
          <MenuItem section="downloads">Downloads</MenuItem>
        </NavigationDrawer>
        <Sections>
          <Content>
            <Textfield label="Home page" />
          </Content>
        </Sections>
      </Scrollable>
    </Container>
  );
});
