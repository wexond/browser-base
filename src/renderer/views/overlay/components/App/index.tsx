import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ThemeProvider } from 'styled-components';
import { hot } from 'react-hot-loader/root';

import { UIStyle } from '~/renderer/mixins/default-styles';
import store from '../../store';
import { StyledApp } from './style';
import { ExtensionPopup } from '../ExtensionPopup';
import { Menu } from '../Menu';

export const App = hot(
  observer(() => {
    const onMenusBlur = React.useCallback(() => {
      store.closeMenu();
    }, []);

    return (
      <ThemeProvider
        theme={{ ...store.theme, dark: store.theme['dialog.lightForeground'] }}
      >
        <StyledApp>
          <UIStyle />
          <ExtensionPopup />
          <div id="menus" tabIndex={0} onBlur={onMenusBlur}>
            {store.menus.map((data) => (
              <Menu key={data.id} data={data}></Menu>
            ))}
          </div>
        </StyledApp>
      </ThemeProvider>
    );
  }),
);
