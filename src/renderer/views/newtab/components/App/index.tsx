import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store, { QuickRange } from '../../store';
import { NavigationDrawer } from '~/renderer/components/NavigationDrawer';
import { Style } from '../../style';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Container } from '~/renderer/components/Pages';
import { GlobalNavigationDrawer } from '~/renderer/components/GlobalNavigationDrawer';

const GlobalStyle = createGlobalStyle`${Style}`;

export default observer(() => {
  return (
    <ThemeProvider theme={store.theme}>
      <Container>
        <GlobalStyle />
        <GlobalNavigationDrawer translucent></GlobalNavigationDrawer>
      </Container>
    </ThemeProvider>
  );
});
