const webpack = require('webpack');
const { join } = require('path');
const getConfig = require('./webpack.config.base');

module.exports = getConfig({
  target: 'electron-renderer',
  mode: 'development',
  devtool: 'eval',
  entry: {
    vendor: [
      'react',
      'react-dom',
      'mobx',
      'mobx-react-lite',
      'styled-components',
      'gsap',
      'pretty-bytes',
      'node-bookmarks-parser',
      'icojs',
      'file-type',
      'electron-extensions',
      'react-hot-loader',
    ],
  },
  output: {
    filename: '[name].bundle.js',
    path: join(__dirname, 'build'),
    library: 'renderer',
    libraryTarget: 'var',
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: join(__dirname, 'build', '[name].json'),
    }),
  ],
});
