import { observer } from 'mobx-react-lite';
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';

import { StyledApp } from './style';
import { Titlebar } from '../Titlebar';
import { Toolbar } from '../Toolbar';
import store from '../../store';
import { UIStyle } from '~/renderer/mixins/default-styles';

const App = observer(() => {
  return (
    <ThemeProvider
      theme={{ ...store.theme, animations: store.settings.object.animations }}
    >
      <StyledApp>
        <UIStyle />
        <Titlebar />
        <Toolbar></Toolbar>
      </StyledApp>
    </ThemeProvider>
  );
});

export default hot(App);
