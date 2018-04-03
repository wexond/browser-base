import { typography } from 'nersent-ui';
import React from 'react';
import ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';
import wpm from 'wexond-package-manager';
import App from './components/App';
import Store from './store';
import Theme from './models/theme';

injectGlobal`
  body {
    user-select: none;
    cursor: default;
    ${typography.body1()}
    margin: 0;
    padding: 0;
  }
`;

const setTheme = (object1: any, object2: any, themeBase: Theme = null, objectName = '') => {
  if (!themeBase) {
    themeBase = object1;
  }

  for (const key in object1) {
    const newName = `${objectName}.${key}`;

    if (object2[key] != null) {
      if (typeof object2[key] !== 'object') {
        object1[key] = object2[key];
      } else {
        setTheme(object1[key], object2[key], themeBase, newName);
      }
    } else if (
      newName === '.tabs.hovered.foreground' ||
      newName === '.tabs.normal.foregrond' ||
      newName === '.tabs.selected.foreground' ||
      newName === '.searchBar.foreground'
    ) {
      // Inherit foregrounds from toolbar foreground
      // if the custom theme hasn't foregrounds set.
      object1[key] = themeBase.toolbar.foreground;
    } else if (
      newName === '.tabs.hovered' ||
      newName === '.tabs.normal' ||
      newName === '.tabs.selected' ||
      newName === '.searchBar'
    ) {
      object1[key] = {
        foreground: themeBase.toolbar.foreground,
      };
    }
  }
};

const wexondAPI = {
  setTheme: (theme: Theme) => {
    setTheme(Store.theme, theme);
  },
};

wpm.list().then((plugins) => {
  for (const plugin of plugins) {
    wpm.run(plugin.namespace, wexondAPI).then(() => {
      wpm.update(plugin.namespace);
    });
  }
});

ReactDOM.render(<App />, document.getElementById('app'));
