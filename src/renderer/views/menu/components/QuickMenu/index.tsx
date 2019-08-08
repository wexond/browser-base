import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { platform } from 'os';

import { Bubble } from '../Bubble';
import { Line, Actions } from './style';
import { icons } from '~/renderer/constants';

const changeContent = () => () => {
  // store.overlay.currentContent = content;
};

const onFindClick = () => {
  /*store.overlay.visible = false;

  ipcRenderer.send(
    `find-show-${store.windowId}`,
    store.tabs.selectedTab.id,
    store.tabs.selectedTab.findInfo,
  );*/
};

const onDarkClick = () => {
  // store.settings.object.darkTheme = !store.settings.object.darkTheme;
  // store.theme = store.settings.object.darkTheme ? darkTheme : lightTheme;
  // store.settings.save();
};

const onShieldClick = () => {
  // store.settings.object.shield = !store.settings.object.shield;
  // store.settings.save();
};

const onAlwaysClick = () => {
  // store.isAlwaysOnTop = !store.isAlwaysOnTop;
  // getCurrentWindow().setAlwaysOnTop(store.isAlwaysOnTop);
};

const onMultrinClick = () => {
  // store.settings.object.multrin = !store.settings.object.multrin;
  // store.settings.save();
};

const onNewWindowClick = () => {
  // ipcRenderer.send('create-window');
};

const onIncognitoClick = () => {
  // ipcRenderer.send('create-window', true);
};

export const QuickMenu = observer(() => {
  // const invert = store.theme['overlay.foreground'] === 'light';
  const invert = false;

  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
        padding: 16,
      }}
    >
      <Actions>
        <Bubble
          // toggled={store.isAlwaysOnTop}
          toggled={false}
          onClick={onAlwaysClick}
          invert={invert}
          icon={icons.window}
        >
          Always on top
        </Bubble>
        <Bubble
          // toggled={store.settings.object.darkTheme}
          toggled={false}
          onClick={onDarkClick}
          invert={invert}
          icon={icons.night}
        >
          Dark mode
        </Bubble>
        <Bubble
          invert={invert}
          // toggled={store.settings.object.shield}
          toggled={false}
          icon={icons.shield}
          onClick={onShieldClick}
        >
          Shield
        </Bubble>
        {platform() === 'win32' && (
          <Bubble
            invert={invert}
            // toggled={store.settings.object.multrin}
            toggled={false}
            icon={icons.multrin}
            onClick={onMultrinClick}
          >
            Multrin
          </Bubble>
        )}
      </Actions>
      <Line />
      <Actions>
        <Bubble invert={invert} icon={icons.history}>
          History
        </Bubble>
        <Bubble invert={invert} icon={icons.bookmarks}>
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
          // disabled={!store.tabs.selectedTab}
          invert={invert}
          icon={icons.find}
          onClick={onFindClick}
        >
          Find
        </Bubble>
      </Actions>

      <Actions>
        <Bubble onClick={onNewWindowClick} invert={invert} icon={icons.window}>
          New window
        </Bubble>
        <Bubble
          onClick={onIncognitoClick}
          invert={invert}
          icon={icons.incognito}
        >
          Incognito
        </Bubble>
      </Actions>
    </div>
  );
});
