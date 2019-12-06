/* eslint-disable */
const { getConfig, applyEntries, getBaseConfig } = require('./webpack.config.base');
const { join } = require('path');
/* eslint-enable */

const PORT = 4445;

const webConfig = getConfig(getBaseConfig('web'), {
  target: 'web',

  devServer: {
    contentBase: join(__dirname, 'build'),
    port: PORT,
    hot: true,
    inline: true,
    disableHostCheck: true,
  },

  externals: { electron: 'require("electron")' },
});

applyEntries('web', webConfig, ['settings', 'history', 'newtab', 'bookmarks']);

module.exports = webConfig;
