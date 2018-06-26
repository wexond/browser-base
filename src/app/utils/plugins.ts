import React from 'react';
import styled from 'styled-components';
import wpm from 'wexond-package-manager';
import PluginAPI from '../models/plugin-api';
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
        colors,
        opacity,
      },
    };

    const { context } = await wpm.run(plugin.namespace, {}, mock);

    const pluginAPI: PluginAPI = context.exports;

    wpm.update(plugin.namespace, false);
  }
};
