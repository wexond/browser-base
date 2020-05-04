import { observer } from 'mobx-react-lite';
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';

import { StyledApp } from './style';
import { Titlebar } from '../Titlebar';
import { Toolbar } from '../Toolbar';
import store from '../../store';
import { UIStyle } from '~/renderer/mixins/default-styles';
import { BookmarkBar } from '../BookmarkBar';
import {
  DEFAULT_TITLEBAR_HEIGHT,
  COMPACT_TITLEBAR_HEIGHT,
  DEFAULT_TAB_MARGIN_TOP,
  COMPACT_TAB_MARGIN_TOP,
  COMPACT_TAB_HEIGHT,
  DEFAULT_TAB_HEIGHT,
} from '~/constants/design';

const App = observer(() => {
  return (
    <ThemeProvider
      theme={{
        ...store.theme,
        animations: store.settings.object.animations,
        isCompact: store.isCompact,
        titlebarHeight: !store.isCompact
          ? DEFAULT_TITLEBAR_HEIGHT
          : COMPACT_TITLEBAR_HEIGHT,
        tabMarginTop: !store.isCompact
          ? DEFAULT_TAB_MARGIN_TOP
          : COMPACT_TAB_MARGIN_TOP,
        tabHeight: store.isCompact ? COMPACT_TAB_HEIGHT : DEFAULT_TAB_HEIGHT,
      }}
    >
      <StyledApp>
        <UIStyle />
        <Titlebar />
        {store.settings.object.topBarVariant === 'default' && <Toolbar />}
        <BookmarkBar />
      </StyledApp>
    </ThemeProvider>
  );
});

export default hot(App);
