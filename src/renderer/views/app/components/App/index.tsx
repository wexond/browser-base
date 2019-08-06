import { observer } from 'mobx-react-lite';
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { Style } from '../../style';
import { ipcRenderer } from 'electron';
import { Line, StyledApp } from './style';
import store from '../../store';
import { Tabbar } from '../Toolbar/Tabbar';
import { Toolbar } from '../Toolbar';

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
        <Tabbar />
        <Toolbar />
        <Line />
        <GlobalStyle />
      </StyledApp>
    </ThemeProvider>
  );
});

export default hot(App);
