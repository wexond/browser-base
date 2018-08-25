import wpm from 'wexond-package-manager';
import { colors, transparency } from '~/renderer/defaults';

export const loadPlugins = async () => {
  const plugins = await wpm.list();

  for (const plugin of plugins) {
    const mock = {
      fs: {},
      wexond: {
        colors,
        transparency,
      },
    };

    const { context } = await wpm.run(plugin.namespace, {}, mock);

    const pluginAPI = context.exports;

    /*
    for (const key in components) {
      if (pluginAPI[key] && components[key]) {
        components[key] = { ...components[key], ...pluginAPI[key] };
      }
    } */
    wpm.update(plugin.namespace, false);
  }
};
