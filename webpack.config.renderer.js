/* eslint-disable */
const { getConfig, applyEntries, getBaseConfig } = require('./webpack.config.base');
const { join } = require('path');
/* eslint-enable */

const PORT = 4444;

const appConfig = getConfig(getBaseConfig('app'), {
  target: 'electron-renderer',

  devServer: {
    contentBase: join(__dirname, 'build'),
    port: PORT,
    hot: true,
    inline: true,
    disableHostCheck: true,
  },
});

applyEntries('app', appConfig, [
  'app',
  'permissions',
  'auth',
  'form-fill',
  'credentials',
  'find',
  'menu',
  'search',
  'preview',
  'tabgroup',
  'downloads',
  'add-bookmark',
]);

module.exports = appConfig;
