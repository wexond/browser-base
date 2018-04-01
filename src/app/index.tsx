import { typography } from 'nersent-ui';
import React from 'react';
import ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';
import wpm from 'wexond-package-manager';
import App from './components/App';
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

      if (typeof api.setTheme === 'function') {
        const theme = api.setTheme();
        if (theme.toolbar) {
          Store.theme.toolbar = {
            ...Store.theme.toolbar,
            ...theme.toolbar,
          };
        }

        if (theme.searchBar != null) {
          Store.theme.searchBar = {
            ...Store.theme.searchBar,
            ...theme.searchBar,
          };
        }

        if (theme.tabs != null) {
          Store.theme.tabs = {
            ...Store.theme.tabs,
            ...theme.tabs,
          };
        }

        if (theme.tabbar != null) {
          Store.theme.tabbar = {
            ...Store.theme.tabbar,
            ...theme.tabbar,
          };
        }

        if (theme.toolbarButtons != null) {
          Store.theme.toolbarButtons = {
            ...Store.theme.toolbarButtons,
            ...theme.toolbarButtons,
          };
        }

        if (theme.addTabButton != null) {
          Store.theme.addTabButton = {
            ...Store.theme.addTabButton,
            ...theme.addTabButton,
          };
        }

        if (theme.accentColor != null) {
          Store.theme.accentColor = theme.accentColor;
        }

        if (theme.suggestions != null) {
          Store.theme.suggestions = {
            ...Store.theme.suggestions,
            ...theme.suggestions,
          };
        }
      }
    });
  }
});

ReactDOM.render(<App />, document.getElementById('app'));
