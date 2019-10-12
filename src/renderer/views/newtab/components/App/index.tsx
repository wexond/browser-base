import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { hot } from 'react-hot-loader/root';

import store from '../../store';
import { Style } from '../../style';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Wrapper, Content } from './style';
import { TopSites } from '../TopSites';

const GlobalStyle = createGlobalStyle`${Style}`;

export default hot(
  observer(() => {
    return (
      <ThemeProvider theme={store.theme}>
        <GlobalStyle />
        <Wrapper>
          <Content>
            <TopSites></TopSites>
          </Content>
        </Wrapper>
      </ThemeProvider>
    );
  }),
);
