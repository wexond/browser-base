import wpm from 'wexond-package-manager';
import Store from '../store';
import Theme from '../models/theme';

export const loadPlugins = () => {
  const wexondAPI = {
    setTheme: (theme: Theme) => {
      Store.theme.set(theme);
    },
  };

  wpm.list().then((plugins) => {
    for (const plugin of plugins) {
      wpm.run(plugin.namespace, wexondAPI).then(() => {
        wpm.update(plugin.namespace);
      });
    }
  });
};
