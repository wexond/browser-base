import React from 'react';
import styled from 'styled-components';
import wpm from 'wexond-package-manager';
import Tab from '../components/Tab';
import PluginAPI from '../models/plugin-api';
import Store from '../store';
import { Theme } from '../../shared/models/theme';
import colors from '../../shared/defaults/colors';
import opacity from '../../shared/defaults/opacity';

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
        colors,
        opacity,
      },
    };

    const { result, context } = await wpm.run(plugin.namespace, {}, mock);

    let pluginAPI: PluginAPI = context.exports;

    if (result) {
      pluginAPI = result as PluginAPI;
    }

    // Check if decorateTab is a function and has one argument.
    if (typeof pluginAPI.decorateTab === 'function' && pluginAPI.decorateTab.length === 1) {
      Store.decoratedTab = pluginAPI.decorateTab(Tab);
    }

    wpm.update(plugin.namespace, false);
  }
};
