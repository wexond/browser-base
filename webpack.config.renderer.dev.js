const webpack = require('webpack');
const getConfig = require('./webpack.config.base');
const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PORT = 4444;

const output = {
  publicPath: `http://localhost:${PORT}/`,
};

const config = {
  devtool: 'eval-source-map',
  plugins: [new webpack.HotModuleReplacementPlugin()],
  output,
  mode: 'development',
  target: 'electron-renderer',

  devServer: {
    contentBase: join(__dirname, 'dist'),
    port: PORT,
    hot: true,
    inline: true,
    historyApiFallback: {
      verbose: true,
      disableDotRule: false,
    },
  },
};

const appConfig = getConfig(config, {
  entry: {
    app: ['react-hot-loader/patch', './src/renderer/views/app'],
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
    runtimeChunk: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Wexond',
      template: 'static/pages/app.html',
      filename: 'app.html',
    }),
  ],
});

module.exports = [appConfig];
