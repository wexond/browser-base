import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { injectGlobal } from 'styled-components';

import { Style } from './styles';
import { runServices } from './services';
import App from './components/app';

injectGlobal`${Style}`;

const render = (AppComponent: any) => {
  ReactDOM.render(
    <AppContainer>
      <AppComponent />
    </AppContainer>,
    document.getElementById('app'),
  );
};
(async function setup() {
  runServices();

  render(App);

  createWorkspace();
})();

// react-hot-loader
if ((module as any).hot) {
  (module as any).hot.accept();
}
