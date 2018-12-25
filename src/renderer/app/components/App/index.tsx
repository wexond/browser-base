import { observer } from 'mobx-react';
import * as React from 'react';
import { createGlobalStyle } from 'styled-components';

import { Style } from '~/renderer/app/style';
import Toolbar from '../Toolbar';
import { Line } from './style';

const GlobalStyle = createGlobalStyle`${Style}`;

@observer
class App extends React.Component {
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
