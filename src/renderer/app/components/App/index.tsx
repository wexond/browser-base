import { observer } from 'mobx-react';
import * as React from 'react';
import { createGlobalStyle } from 'styled-components';

import { Style } from '~/renderer/app/style';
import Toolbar from '../Toolbar';
import { Line } from './style';
import { ipcRenderer } from 'electron';

const GlobalStyle = createGlobalStyle`${Style}`;

window.onbeforeunload = () => {
  ipcRenderer.send('browserview-clear');
};

@observer
class App extends React.Component {
  public componentWillUnmount() {
    ipcRenderer.send('browserview-clear');
  }

  public render() {
    return (
      <React.Fragment>
        <GlobalStyle />
        <Toolbar />
      </React.Fragment>
    );
  }
}

export default App;
