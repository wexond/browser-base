/* eslint-disable */
const webpack = require('webpack');
const { getConfig, dev } = require('./webpack.config.base');
const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
/* eslint-enable */

const PORT = 4444;

const getHtml = name => {
  return new HtmlWebpackPlugin({
    title: 'Wexond',
    template: 'static/pages/app.html',
    filename: `${name}.html`,
    chunks: ['vendor', name],
  });
};

const applyEntries = (config, entries) => {
  for (const entry of entries) {
    config.entry[entry] = [`./src/renderer/views/${entry}`];
    config.plugins.push(getHtml(entry));

    if (dev) {
      config.entry[entry].unshift('react-hot-loader/patch');
    }
  }
};

const config = {
  plugins: [new HardSourceWebpackPlugin()],

  output: {},

  entry: {
    vendor: [
      'react',
      'react-dom',
      'mobx',
      'mobx-react-lite',
      'styled-components',
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: 'vendor',
          enforce: true,
        },
      },
    },
  },
};

if (dev) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

const appConfig = getConfig(config, {
  target: 'electron-renderer',

  devServer: {
    contentBase: join(__dirname, 'build'),
    port,
    hot: true,
    inline: true,
  },
});

const webConfig = getConfig(config, {
  target: 'web',
});

applyEntries(appConfig, [
  'app',
  'permissions',
  'auth',
  'form-fill',
  'credentials',
  'find',
]);

applyEntries(webConfig, ['settings']);

module.exports = [appConfig, webConfig];
