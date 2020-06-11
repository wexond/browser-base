import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ThemeProvider } from 'styled-components';
import { hot } from 'react-hot-loader/root';

import { UIStyle } from '~/renderer/mixins/default-styles';
import store from '../../store';
import { StyledApp } from './style';
import { ExtensionPopup } from '../ExtensionPopup';

export const App = hot(
  observer(() => {
    return (
      <ThemeProvider
        theme={{ ...store.theme, dark: store.theme['dialog.lightForeground'] }}
      >
        <StyledApp>
          <UIStyle />
          <ExtensionPopup />
        </StyledApp>
      </ThemeProvider>
    );
  }),
);
