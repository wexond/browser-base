import wpm from 'wexond-package-manager';
import Store from '../store';
import Theme from '../models/theme';
import Tab from '../components/Tab';
import React from 'react';
import PluginAPI from '../models/plugin-api';

export const loadPlugins = async () => {
  const wexondAPI = {
    setTheme: (theme: Theme) => {
      Store.theme.set(theme);
    },
  };

  const plugins = await wpm.list();

  for (const plugin of plugins) {
    const data: PluginAPI = await wpm.run(plugin.namespace, wexondAPI, {
      fs: {},
      react: React,
    });

    Store.decoratedTab = data.decorateTab(Tab);
    wpm.update(plugin.namespace, false);
  }
};
