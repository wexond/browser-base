import * as React from 'react';
import { observer } from 'mobx-react';

import { Sections } from './styles';
import { Textfield } from '~/renderer/components/Textfield';
import { SettingsSection } from '~/renderer/views/app/store/settings';
import { NavigationDrawer } from '../../components/NavigationDrawer';
import store from '~/renderer/views/app/store';
import { Container, Scrollable, Content, Title } from '../../style';
import { Button } from '~/renderer/components/Button';

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

const setLanguage = (l: any) => {
  // false specifies if you want to reload the page
  store.locale.setLanguage(l, false);
};

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
        <NavigationDrawer title={store.locale.lang.settings[0].title} search>
          <MenuItem section="general">{store.locale.lang.settings[0].general}</MenuItem>
          <MenuItem section="appearance">{store.locale.lang.settings[0].appearance}</MenuItem>
          <MenuItem section="autofill">{store.locale.lang.settings[0].autofill}</MenuItem>
          <MenuItem section="search-engine">{store.locale.lang.settings[0].search_engine}</MenuItem>
          <MenuItem section="startup">{store.locale.lang.settings[0].on_startup}</MenuItem>
          <MenuItem section="language">{store.locale.lang.settings[0].language}</MenuItem>
          <MenuItem section="weather">{store.locale.lang.settings[0].weather}</MenuItem>
          <MenuItem section="shortcuts">{store.locale.lang.settings[0].keyboard_shrtcts}</MenuItem>
          <MenuItem section="downloads">{store.locale.lang.settings[0].downloads}</MenuItem>
        </NavigationDrawer>
        <Sections>
          {store.settings.selectedSection === 'general' && <Content>
            <Textfield label="Home page" />
          </Content>}
          {store.settings.selectedSection === 'language' && <Content>
            <Title>Current Language: {store.locale.currentLanguage}</Title>
            <Button style={{ width: '200px' }} onClick={() => setLanguage("en")}>Set language to English</Button>
            <Button style={{ width: '200px' }} onClick={() => setLanguage("pl")}>Set language to Polish</Button>
            <Title>It even saves your language choice on restart. Try it.</Title>
            <Button style={{ width: '200px' }} onClick={() => store.locale.setLanguage(store.locale.currentLanguage, true)}>Reload to take effect</Button>
            <Title>{store.locale.lang.settings[0].example_sentence}</Title>
          </Content>}
        </Sections>
      </Scrollable>
    </Container>
  );
});
