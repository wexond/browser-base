import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { hot } from 'react-hot-loader/root';

import { Style } from '../../style';
import { StyledApp } from './style';
import { QuickMenu } from '../QuickMenu';
import store from '../../store';

const GlobalStyle = createGlobalStyle`${Style}`;

export const App = hot(
  observer(() => {
    return (
      <ThemeProvider
        theme={{ ...store.theme, dark: store.theme['dialog.lightForeground'] }}
      >
        <StyledApp visible={store.visible}>
          <QuickMenu />
          <GlobalStyle />
        </StyledApp>
      </ThemeProvider>
    );
  }),
);
