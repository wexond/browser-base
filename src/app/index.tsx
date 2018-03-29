import React from 'react';
import ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';
import wpm from 'wexond-package-manager';
import { typography } from 'nersent-ui';

// Components
import App from './components/App';

// Models
import PluginAPI from './models/plugin-api';

import Store from './store';

injectGlobal`
  body {
    user-select: none;
    cursor: default;
    ${typography.body1()}
    margin: 0;
    padding: 0;
  }
`;

wpm.list().then((plugins) => {
  for (const plugin of plugins) {
    wpm.run(plugin.namespace).then((pkg) => {
      const api = pkg as PluginAPI;

      if (api.theme.toolbar != null) {
        Store.theme.toolbar = {
          ...Store.theme.toolbar,
          ...api.theme.toolbar,
        };
      }

      if (api.theme.searchBar != null) {
        Store.theme.searchBar = {
          ...Store.theme.searchBar,
          ...api.theme.searchBar,
        };
      }

      if (api.theme.accentColor != null) {
        Store.theme.accentColor = api.theme.accentColor;
      }
    });
  }
});

ReactDOM.render(<App />, document.getElementById('app'));
