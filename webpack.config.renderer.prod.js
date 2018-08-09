const webpack = require('webpack');
const merge = require('webpack-merge');
const { resolve } = require('path');
const baseConfig = require('./webpack.config.base');

module.exports = merge.smart(baseConfig, {
  devtool: 'source-map',
  target: 'electron-renderer',
  mode: 'production',

  output: {
    path: resolve(__dirname, 'build'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.(png|gif|jpg|woff2|ttf|svg)$/,
        use: ['url-loader'],
      },
    ],
  },

  entry: {
    app: ['./src/renderer/views/app'],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
});
