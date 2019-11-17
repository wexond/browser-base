import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { hot } from 'react-hot-loader/root';

import { Style } from '../../style';
import { StyledApp } from './style';
import store from '../../store';
import { Textfield } from '~/renderer/components/Textfield';
import { ipcRenderer } from 'electron';

const GlobalStyle = createGlobalStyle`${Style}`;

const onChange = (e: any) => {
  ipcRenderer.send(`edit-tabgroup-${store.windowId}`, {
    name: store.inputRef.current.value,
    id: store.tabGroupId,
  });
};

export const App = hot(
  observer(() => {
    return (
      <ThemeProvider theme={{ ...store.theme }}>
        <StyledApp visible={store.visible}>
          <GlobalStyle />
          <Textfield
            placeholder="Name"
            style={{ width: '100%' }}
            onChange={onChange}
            ref={store.inputRef}
          />
        </StyledApp>
      </ThemeProvider>
    );
  }),
);
