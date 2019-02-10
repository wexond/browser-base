import { observer } from 'mobx-react';
import * as React from 'react';
import { createGlobalStyle } from 'styled-components';

import { Style } from '~/renderer/overlay/style';
import { ipcRenderer } from 'electron';

const GlobalStyle = createGlobalStyle`${Style}`;

window.onbeforeunload = () => {
  ipcRenderer.send('browserview-clear');
};

window.onclick = () => {
  ipcRenderer.send('hide-overlay');
};

export const App = observer(() => {
  return (
    <React.Fragment>
      <GlobalStyle />
    </React.Fragment>
  );
});
