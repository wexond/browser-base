import * as React from 'react';
import { observer } from 'mobx-react';
import { createGlobalStyle } from 'styled-components';

import { Button } from '~/renderer/components/Button';
import { Style } from '../../style';
import { StyledApp, Title, Buttons } from './style';

const GlobalStyle = createGlobalStyle`${Style}`;

export const App = observer(() => {
  return (
    <StyledApp>
      <GlobalStyle />
      <Title>Title</Title>
      <Buttons>
        <Button foreground="black" background="rgba(0, 0, 0, 0.08)">
          Allow
        </Button>
        <Button
          foreground="black"
          background="rgba(0, 0, 0, 0.08)"
          style={{ marginLeft: 8 }}
        >
          Deny
        </Button>
      </Buttons>
      <div style={{ clear: 'both' }}></div>
    </StyledApp>
  );
});
