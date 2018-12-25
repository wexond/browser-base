import { observer } from 'mobx-react';
import * as React from 'react';
import { createGlobalStyle } from 'styled-components';

import { Style } from '~/renderer/app/style';
import Toolbar from '../Toolbar';

const GlobalStyle = createGlobalStyle`${Style}`;

@observer
class App extends React.Component {
  public render() {
    return (
      <div>
        <GlobalStyle />
        <Toolbar />
      </div>
    );
  }
}

export default App;
