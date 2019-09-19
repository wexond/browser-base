import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { Style } from '../../style';
import { StyledApp } from './style';
import { QuickMenu } from '../QuickMenu';
import store from '../../store';

const GlobalStyle = createGlobalStyle`${Style}`;

export const App = observer(() => {
  return (
    <ThemeProvider theme={store.theme}>
      <StyledApp visible={store.visible}>
        <QuickMenu />
        <GlobalStyle />
      </StyledApp>
    </ThemeProvider>
  );
});
