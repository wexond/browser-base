import { colors, transparency } from 'nersent-ui';
import React from 'react';
import styled from 'styled-components';
import wpm from 'wexond-package-manager';
import Tab from '../components/Tab';
import PluginAPI from '../models/plugin-api';
import Theme from '../models/theme';
import Store from '../store';

export const loadPlugins = async () => {
  const plugins = await wpm.list();

  for (const plugin of plugins) {
    const mock = {
      fs: {},
      react: React,
      styled,
      wexond: {
        setTheme: (theme: Theme) => {
          Store.theme.set(theme);
        },
        transparency,
        colors,
      },
    };

    const data: PluginAPI = await wpm.run(plugin.namespace, {}, mock);

    // Check if decorateTab is a function and has one argument.
    if (typeof data.decorateTab === 'function' && data.decorateTab.length === 1) {
      Store.decoratedTab = data.decorateTab(Tab);
    }

    wpm.update(plugin.namespace, false);
  }
};
