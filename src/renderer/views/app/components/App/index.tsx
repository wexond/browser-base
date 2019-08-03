import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { WindowsControls } from 'react-windows-controls';

import { Style } from '../../style';
import { Toolbar } from '../Toolbar';
import { ipcRenderer } from 'electron';
import { Line, StyledApp } from './style';
import { platform } from 'os';
import { Overlay } from '../Overlay';
import store from '../../store';
import { closeWindow, minimizeWindow, maximizeWindow } from '../../utils';
import { TOOLBAR_HEIGHT } from '../../constants';

const GlobalStyle = createGlobalStyle`${Style}`;

window.onbeforeunload = () => {
  ipcRenderer.send(`browserview-clear-${store.windowId}`);
};

const App = observer(() => {
  return (
    <ThemeProvider
      theme={{ ...store.theme, animations: store.settings.object.animations }}
    >
      <StyledApp
        style={{ backgroundColor: store.theme['overlay.backgroundColor'] }}
      >
        <GlobalStyle />
        <Toolbar />
        <Line />
        <Overlay />
        {platform() !== 'darwin' && (
          <WindowsControls
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              zIndex: 9999,
              height: TOOLBAR_HEIGHT,
              WebkitAppRegion: 'no-drag',
            }}
            dark={
              store.overlay.visible
                ? store.theme['overlay.windowsButtons.invert']
                : store.theme['toolbar.icons.invert']
            }
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
          />
        )}
      </StyledApp>
    </ThemeProvider>
  );
});

export default hot(App);
