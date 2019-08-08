import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { createGlobalStyle } from 'styled-components';

import { Style } from '../../style';
import { StyledApp } from './style';
import { QuickMenu } from '../QuickMenu';

const GlobalStyle = createGlobalStyle`${Style}`;

export const App = observer(() => {
  return (
    <StyledApp>
      <QuickMenu />
      <GlobalStyle />
    </StyledApp>
  );
});
