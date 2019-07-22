import * as React from 'react';
import { observer } from 'mobx-react';
import { createGlobalStyle } from 'styled-components';

import { Style } from '../../style';
import { StyledApp, StyledList } from './style';

const GlobalStyle = createGlobalStyle`${Style}`;

export const App = observer(() => {
  return (
    <StyledApp>
      <GlobalStyle />
      <StyledList>XDDWd</StyledList>
    </StyledApp>
  );
});
