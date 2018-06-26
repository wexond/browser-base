import React from 'react';
import styled from 'styled-components';
import wpm from 'wexond-package-manager';
import colors from '../../shared/defaults/colors';
import opacity from '../../shared/defaults/opacity';
import components from '../components';
import { StyledTab } from '../components/Tab/styles';

export const loadPlugins = async () => {
  const plugins = await wpm.list();

  for (const plugin of plugins) {
    const mock = {
      fs: {},
      react: React,
      'styled-components': styled,
      wexond: {
        colors,
        opacity,
      },
      'wexond-components': {
        StyledTab,
      },
    };

    const { context } = await wpm.run(plugin.namespace, {}, mock);

    const pluginAPI = context.exports;

    for (const key in components) {
      if (pluginAPI[key] && components[key]) {
        components[key] = pluginAPI[key];
      }
    }
    wpm.update(plugin.namespace, false);
  }
};
