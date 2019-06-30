import * as React from 'react';
import { observer } from 'mobx-react';
import { ipcRenderer } from 'electron';
import { platform } from 'os';

import { Section, Actions } from '../../../style';
import { preventHiding } from '../../..';
import { Bubble } from '../Bubble';
import { Line } from './style';
import { darkTheme, lightTheme } from '~/renderer/constants/themes';
import { OverlayContent } from '~/renderer/views/app/store/overlay';
import store from '~/renderer/views/app/store';
import { getCurrentWindow } from '~/renderer/views/app/utils';
import { icons } from '~/renderer/constants';

const changeContent = (content: OverlayContent) => () => {
  store.overlay.currentContent = content;
};

const onFindClick = () => {
  store.overlay.visible = false;

  ipcRenderer.send(
    'find-show',
    store.tabs.selectedTab.id,
    store.tabs.selectedTab.findInfo,
  );
};

const onDarkClick = () => {
  store.settings.object.isDarkTheme = !store.settings.object.isDarkTheme;
  store.theme = store.settings.object.isDarkTheme ? darkTheme : lightTheme;
  store.settings.save();
};

const onShieldClick = () => {
  store.settings.object.isShieldToggled = !store.settings.object
    .isShieldToggled;
  store.settings.save();
};

const onAlwaysClick = () => {
  store.isAlwaysOnTop = !store.isAlwaysOnTop;
  getCurrentWindow().setAlwaysOnTop(store.isAlwaysOnTop);
};

const onMultrinClick = () => {
  store.settings.object.isMultrinToggled = !store.settings.object
    .isMultrinToggled;
  store.settings.save();
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
          toggled={store.settings.object.isDarkTheme}
          onClick={onDarkClick}
          invert={invert}
          icon={icons.night}
        >
          Dark mode
        </Bubble>
        <Bubble
          invert={invert}
          toggled={store.settings.object.isShieldToggled}
          icon={icons.shield}
          onClick={onShieldClick}
        >
          Shield
        </Bubble>
        {platform() === 'win32' && (
          <Bubble
            invert={invert}
            toggled={store.settings.object.isMultrinToggled}
            icon={icons.multrin}
            onClick={onMultrinClick}
          >
            Multrin
          </Bubble>
        )}
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
        <Bubble
          disabled
          invert={invert}
          icon={icons.settings}
          onClick={changeContent('settings')}
        >
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
