import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { hot } from 'react-hot-loader/root';

import { Style } from '../../style';
import { StyledApp, Title, Domain } from './style';
import store from '../../store';

const GlobalStyle = createGlobalStyle`${Style}`;

export const App = hot(
  observer(() => {
    return (
      <ThemeProvider theme={{ ...store.theme }}>
        <StyledApp
          style={{ transform: `translate3d(${store.x}px, 0, 0)` }}
          xTransition={store.xTransition}
          visible={store.visible}
        >
          <Title>{store.title}</Title>
          <Domain>{store.domain}</Domain>
          <GlobalStyle />
        </StyledApp>
      </ThemeProvider>
    );
  }),
);
