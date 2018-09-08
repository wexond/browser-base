import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { injectGlobal } from 'styled-components';

import App from './components/App';
import { Style } from '../styles';

injectGlobal`${Style}`;

injectGlobal`
  body {
    overflow-y: auto;
  }
`;

const render = (AppComponent: any) => {
  ReactDOM.render(
    <AppContainer>
      <AppComponent />
    </AppContainer>,
    document.getElementById('app'),
  );
};

render(App);

// react-hot-loader
if ((module as any).hot) {
  (module as any).hot.accept();
}
