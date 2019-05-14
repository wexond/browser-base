import * as React from 'react';
import { observer } from 'mobx-react';
import { Section, Actions } from '../Overlay/style';
import { preventHiding, Header } from '../Overlay';
import { Bubble } from '../Bubble';
import { icons } from '../../constants';
import store from '../../store';
import { Line } from './style';
import { darkTheme, lightTheme } from '~/renderer/constants/themes';
import { getCurrentWindow } from '../../utils';
import { ipcRenderer } from 'electron';

const changeContent = (content: 'history' | 'default' | 'bookmarks') => () => {
  store.overlay.currentContent = content;
};

const onFindClick = () => {
  store.overlay.visible = false;

  store.tabs.selectedTab.findVisible = true;

  setTimeout(() => {
    store.tabs.selectedTab.findVisible = true;
  }, 200);
};

const onDarkClick = () => {
  store.settings.isDarkTheme = !store.settings.isDarkTheme;
  store.theme = store.settings.isDarkTheme ? darkTheme : lightTheme;
  store.saveSettings();
};

const onShieldClick = () => {
  store.settings.isShieldToggled = !store.settings.isShieldToggled;
  store.saveSettings();
  ipcRenderer.send('shield-toggle', store.settings.isShieldToggled);
};

const onAlwaysClick = () => {
  store.isAlwaysOnTop = !store.isAlwaysOnTop;
  getCurrentWindow().setAlwaysOnTop(store.isAlwaysOnTop);
};

export const QuickMenu = observer(() => {
  const invert = store.theme['overlay.foreground'] === 'light';
  return (
    <Section
      onClick={preventHiding}
      style={{
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
        padding: 16,
      }}
    >
      <Actions>
        <Bubble
          toggled={store.isAlwaysOnTop}
          onClick={onAlwaysClick}
          invert={invert}
          icon={icons.window}
        >
          Always on top
        </Bubble>
        <Bubble
          toggled={store.settings.isDarkTheme}
          onClick={onDarkClick}
          invert={invert}
          icon={icons.night}
        >
          Dark mode
        </Bubble>
        <Bubble
          invert={invert}
          toggled={store.settings.isShieldToggled}
          icon={icons.shield}
          onClick={onShieldClick}
        >
          Shield
        </Bubble>
      </Actions>
      <Line />
      <Actions>
        <Bubble
          onClick={changeContent('history')}
          invert={invert}
          icon={icons.history}
        >
          History
        </Bubble>
        <Bubble
          onClick={changeContent('bookmarks')}
          invert={invert}
          icon={icons.bookmarks}
        >
          Bookmarks
        </Bubble>
        <Bubble disabled invert={invert} icon={icons.download}>
          Downloads
        </Bubble>
        <Bubble invert={invert} icon={icons.settings}>
          Settings
        </Bubble>
        <Bubble disabled invert={invert} icon={icons.extensions}>
          Extensions
        </Bubble>
        <Bubble
          disabled={!store.tabs.selectedTab}
          invert={invert}
          icon={icons.find}
          onClick={onFindClick}
        >
          Find
        </Bubble>
      </Actions>

      <Actions>
        <Bubble disabled invert={invert} icon={icons.window}>
          New window
        </Bubble>
        <Bubble disabled invert={invert} icon={icons.window}>
          Incognito
        </Bubble>
        <Bubble disabled invert={invert} icon={icons.window}>
          Tor
        </Bubble>
      </Actions>
    </Section>
  );
});
