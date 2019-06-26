import * as React from 'react';
import { observer } from 'mobx-react';
import { createGlobalStyle } from 'styled-components';

import { Style } from '../../style';
import { StyledApp, Title, Buttons, Subtitle } from './style';
import { Button } from '~/renderer/components/Button';
import store from '../../store';

const GlobalStyle = createGlobalStyle`${Style}`;

export const App = observer(() => {
  return (
    <StyledApp>
      <GlobalStyle />
      <Title>Login</Title>
      <Subtitle>{store.url}</Subtitle>
      <Buttons>
        <Button>Login</Button>
        <Button
          foreground="black"
          background="rgba(0, 0, 0, 0.08)"
          style={{ marginLeft: 8 }}
        >
          Cancel
        </Button>
      </Buttons>
    </StyledApp>
  );
});
