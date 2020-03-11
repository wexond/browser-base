import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { hot } from 'react-hot-loader/root';

import { SettingsSection } from '../../store';
import { Appearance } from '../Appearance';
import { AddressBar } from '../AddressBar';
import { Privacy } from '../Privacy';
import store from '../../store';
import { NavigationDrawer } from '~/renderer/components/NavigationDrawer';
import { Style } from '../../style';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Autofill } from '../Autofill';
import { OnStartup } from '../Startup';
import { Content, LeftContent, Container } from '~/renderer/components/Pages';
import { GlobalNavigationDrawer } from '~/renderer/components/GlobalNavigationDrawer';
import { Downloads } from '../Downloads';
import {
  ICON_PALETTE,
  ICON_AUTOFILL,
  ICON_POWER,
  ICON_SEARCH,
  ICON_DOWNLOAD,
  ICON_SHIELD,
} from '~/renderer/constants';

const GlobalStyle = createGlobalStyle`${Style}`;
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
      onClick={() => (store.selectedSection = section)}
      selected={store.selectedSection === section}
      icon={icon}
    >
      {children}
    </NavigationDrawer.Item>
  ),
);

export default hot(
  observer(() => {
    const { selectedSection } = store;

    return (
      <ThemeProvider
        theme={{ ...store.theme, dark: store.theme['pages.lightForeground'] }}
      >
        <Container>
          <GlobalStyle />
          <GlobalNavigationDrawer></GlobalNavigationDrawer>
          <NavigationDrawer title="Settings" search>
            <MenuItem icon={ICON_PALETTE} section="appearance">
              Appearance
            </MenuItem>
            <MenuItem icon={ICON_AUTOFILL} section="autofill">
              Autofill
            </MenuItem>
            <MenuItem icon={ICON_POWER} section="startup">
              On startup
            </MenuItem>
            <MenuItem icon={ICON_SEARCH} section="address-bar">
              Address bar
            </MenuItem>
            <MenuItem icon={ICON_DOWNLOAD} section="downloads">
              Downloads
            </MenuItem>
            <MenuItem icon={ICON_SHIELD} section="privacy">
              Privacy
            </MenuItem>
            {/* <MenuItem section="permissions">Site permissions</MenuItem> */}

            {/* <MenuItem section="language">Languages</MenuItem> */}
            {/* <MenuItem section="shortcuts">Keyboard shortcuts</MenuItem> */}
            {/* <MenuItem section="system">System</MenuItem> */}
          </NavigationDrawer>
          <Content>
            <LeftContent style={{ maxWidth: 800 }}>
              {selectedSection === 'appearance' && <Appearance />}
              {selectedSection === 'autofill' && <Autofill />}
              {selectedSection === 'address-bar' && <AddressBar />}
              {selectedSection === 'startup' && <OnStartup />}
              {selectedSection === 'privacy' && <Privacy />}
              {selectedSection === 'downloads' && <Downloads />}
            </LeftContent>
          </Content>
        </Container>
      </ThemeProvider>
    );
  }),
);
