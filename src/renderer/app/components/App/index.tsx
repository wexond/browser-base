import { observer } from 'mobx-react';
import * as React from 'react';
import { createGlobalStyle } from 'styled-components';

import { Style } from '~/renderer/app/style';
import { Toolbar } from '../Toolbar';
import { Overlay } from '../Overlay';
import { ipcRenderer } from 'electron';
import { Line } from './style';
import store from '../../store';

const GlobalStyle = createGlobalStyle`${Style}`;

window.onbeforeunload = () => {
  ipcRenderer.send('browserview-clear');
};

export const App = observer(() => {
  return (
    <React.Fragment>
      <GlobalStyle />
      <Toolbar />
      <Line />
      <Overlay />
    </React.Fragment>
  );
});
