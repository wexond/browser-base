const merge = require('webpack-merge');
const { resolve } = require('path');

const baseConfig = require('./webpack.config.base');

module.exports = (env, argv) =>
  merge.smart(baseConfig, {
    devtool: argv.mode === 'development' ? 'eval-source-map' : 'cheap-module-source-map',
    target: 'electron-renderer',

    output: {
      path: resolve(__dirname, 'build'),
      filename: '[name].js',
    },

    entry: {
      'webview-preload': './src/preloads/webview-preload.ts',
      'background-page-preload': './src/preloads/background-page-preload.ts',
    },
  });
