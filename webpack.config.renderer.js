/* eslint-disable */
const {
  getConfig,
  applyEntries,
  getBaseConfig,
} = require('./webpack.config.base');
const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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

const extPopupConfig = getConfig({
  target: 'electron-renderer',

  entry: {},
  output: {},

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
  'permissions',
  'auth',
  'find',
  'menu',
  'search',
  'preview',
  'tabgroup',
  'downloads-dialog',
  'add-bookmark',
  'zoom',
]);

if (process.env.ENABLE_EXTENSIONS) {
  extPopupConfig.entry['extension-popup'] = [
    `./src/renderer/views/extension-popup`,
  ];
  extPopupConfig.plugins.push(
    new HtmlWebpackPlugin({
      title: 'Wexond',
      template: 'static/pages/extension-popup.html',
      filename: `extension-popup.html`,
      chunks: [`vendor.app`, 'extension-popup'],
    }),
  );

  module.exports = [appConfig, extPopupConfig];
} else {
  module.exports = appConfig;
}
