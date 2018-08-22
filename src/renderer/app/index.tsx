import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { injectGlobal } from 'styled-components';

import { Style } from './styles';
import { runServices } from './services';
import App from './components/App';
import store from '@app/store';

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

  store.tabsStore.addGroup();
})();

// react-hot-loader
if ((module as any).hot) {
  (module as any).hot.accept();
}
