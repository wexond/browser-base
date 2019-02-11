import { observer } from 'mobx-react';
import * as React from 'react';
import { createGlobalStyle } from 'styled-components';

import { Style } from '~/renderer/app/style';
import { Toolbar } from '../Toolbar';
import { ipcRenderer } from 'electron';
import { Line, Overlay } from './style';
import store from '../../store';

const GlobalStyle = createGlobalStyle`${Style}`;

window.onbeforeunload = () => {
  ipcRenderer.send('browserview-clear');
};

const onClick = () => {
  store.overlayVisible = false;
  setTimeout(() => {
    ipcRenderer.send('browserview-show');
  }, 200);
};

export const App = observer(() => {
  return (
    <React.Fragment>
      <GlobalStyle />
      <Toolbar />
      <Line />
      <Overlay visible={store.overlayVisible} onClick={onClick} />
    </React.Fragment>
  );
});
