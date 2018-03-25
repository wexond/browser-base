import fs from 'fs';

// Models
import Plugin from '../models/plugin';

// Utils
import { getPath } from './paths';

export const getPlugins = () =>
  new Promise((resolve: (plugins: Plugin[]) => void, reject) => {
    const plugins: Plugin[] = [];

    fs.readdir(getPath('plugins'), (err, pluginsDirs) => {
      if (err) {
        reject(err);
      }

      for (const pluginDir of pluginsDirs) {
        plugins.push(new Plugin(pluginDir));
      }

      resolve(plugins);
    });
  });
