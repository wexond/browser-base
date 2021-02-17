import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ThemeProvider } from 'styled-components';

import { StyledApp, Title, Domain } from './style';
import store from '../../store';
import { UIStyle } from '~/renderer/mixins/default-styles';

export const App = observer(() => {
  return (
    <ThemeProvider theme={{ ...store.theme }}>
      <UIStyle />
      <StyledApp
        style={{ transform: `translate3d(${store.x}px, 0, 0)` }}
        xTransition={store.xTransition}
        visible={store.visible}
      >
        <Title>{store.title}</Title>
        <Domain>{store.domain}</Domain>
      </StyledApp>
    </ThemeProvider>
  );
});
