/* eslint-disable */
const {
  getConfig,
  applyEntries,
  getBaseConfig,
} = require('./webpack.config.base');
const { join } = require('path');
/* eslint-enable */

const PORT = 4444;

const appConfig = getConfig(getBaseConfig('app'), {
  target: 'web',

  devServer: {
    contentBase: join(__dirname, 'build'),
    port: PORT,
    hot: true,
    inline: true,
    disableHostCheck: true,
  },
});

applyEntries('app', appConfig, [
  ...(process.env.ENABLE_AUTOFILL ? ['form-fill', 'credentials'] : []),
  'app',
  'overlay',
  // TODO: sandbox
  // 'permissions',
  // 'auth',
  // 'find',
  // 'menu',
  // 'search',
  // 'preview',
  // 'tabgroup',
  // 'downloads-dialog',
  // 'add-bookmark',
  // 'zoom',
  // 'settings',
  // 'history',
  // 'newtab',
  // 'bookmarks',
]);

module.exports = appConfig;
