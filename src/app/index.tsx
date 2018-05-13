import { typography } from 'nersent-ui';
import fs from 'fs';
import { promisify } from 'util';
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';
import App from './components/App';
import { loadPlugins } from './utils/plugins';
import defaultTheme from './defaults/theme';
import Store from './store';
import { getPath } from './utils/paths';

declare const module: any;

injectGlobal`
  body {
    user-select: none;
    cursor: default;
    ${typography.body1()}
    margin: 0;
    padding: 0;
  }
`;

function render(Component: any) {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app'),
  );
}

async function setup() {
  if (!fs.existsSync(getPath())) {
    fs.mkdirSync(getPath());
  }

  if (!fs.existsSync(getPath('plugins'))) {
    fs.mkdirSync(getPath('plugins'));
  }

  Store.theme.set(defaultTheme);
  await loadPlugins();

  render(App);
}

setup();

if (module.hot) {
  module.hot.accept('./components/App', () => {
    // eslint-disable-next-line
    const NextApp = require('./components/App').default;
    render(NextApp);
  });
}
