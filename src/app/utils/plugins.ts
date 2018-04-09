import { colors, transparency } from 'nersent-ui';
import React from 'react';
import styled from 'styled-components';
import wpm from 'wexond-package-manager';
import Tab from '../components/Tab';
import PluginAPI from '../models/plugin-api';
import { Theme } from '../models/theme';
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
