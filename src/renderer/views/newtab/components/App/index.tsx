import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { hot } from 'react-hot-loader/root';

import store from '../../store';
import { Style } from '../../style';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Wrapper, Content, IconItem, Menu } from './style';
import { TopSites } from '../TopSites';
import { icons } from '~/renderer/constants';

const GlobalStyle = createGlobalStyle`${Style}`;

const onIconClick = (name: string) => () => {
  window.location.href = `wexond://${name}`;
};

export default hot(
  observer(() => {
    return (
      <ThemeProvider theme={store.theme}>
        <GlobalStyle />
        <Wrapper>
          <Menu>
            <IconItem
              icon={icons.settings}
              onClick={onIconClick('settings')}
            ></IconItem>
            <IconItem
              icon={icons.history}
              onClick={onIconClick('history')}
            ></IconItem>
            <IconItem
              icon={icons.bookmarks}
              onClick={onIconClick('bookmarks')}
            ></IconItem>
            <IconItem
              icon={icons.download}
              onClick={onIconClick('downloads')}
            ></IconItem>
            <IconItem
              icon={icons.extensions}
              onClick={onIconClick('extensions')}
            ></IconItem>
          </Menu>
          <Content>
            <TopSites></TopSites>
          </Content>
        </Wrapper>
      </ThemeProvider>
    );
  }),
);
