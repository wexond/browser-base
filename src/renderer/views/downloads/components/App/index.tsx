import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { hot } from 'react-hot-loader/root';

import { Style } from '../../style';
import { StyledApp } from './style';
import store from '../../store';
import { DownloadItem } from '../DownloadItem';

const GlobalStyle = createGlobalStyle`${Style}`;

export const App = hot(
  observer(() => {
    return (
      <ThemeProvider theme={{ ...store.theme }}>
        <StyledApp visible={store.visible}>
          <GlobalStyle />
          {store.downloads.map(item => (
            <DownloadItem item={item} key={item.id}></DownloadItem>
          ))}
        </StyledApp>
      </ThemeProvider>
    );
  }),
);
