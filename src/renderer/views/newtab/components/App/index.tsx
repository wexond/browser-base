import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { hot } from 'react-hot-loader/root';

import store from '../../store';
import { Style } from '../../style';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Container } from '~/renderer/components/Pages';

const GlobalStyle = createGlobalStyle`${Style}`;

export default hot(
  observer(() => {
    return (
      <ThemeProvider theme={store.theme}>
        <Container>
          <GlobalStyle />
        </Container>
      </ThemeProvider>
    );
  }),
);
