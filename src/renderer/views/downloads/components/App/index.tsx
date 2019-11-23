import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { hot } from 'react-hot-loader/root';

import { Style } from '../../style';
import { StyledApp } from './style';
import store from '../../store';
import { DownloadItem } from '../DownloadItem';
import { ipcRenderer } from 'electron';

const GlobalStyle = createGlobalStyle`${Style}`;

export const App = hot(
  observer(() => {
    const height = 8 + Math.min(8, store.downloads.length) * (64 + 8);
    ipcRenderer.send(`height-${store.id}`, height);

    return (
      <ThemeProvider theme={{ ...store.theme }}>
        <StyledApp
          style={{ maxHeight: store.maxHeight }}
          visible={store.visible}
        >
          <GlobalStyle />
          {store.downloads.map(item => (
            <DownloadItem item={item} key={item.id}></DownloadItem>
          ))}
        </StyledApp>
      </ThemeProvider>
    );
  }),
);
