const webpack = require('webpack');
const { getConfig, dev } = require('./webpack.config.base');
const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const PORT = 4444;

const getHtml = name => {
  return new HtmlWebpackPlugin({
    title: 'Wexond',
    template: 'static/pages/app.html',
    filename: `name.html`,
    chunks: ['vendor', name],
  });
};

const config = {
  target: 'electron-renderer',
  plugins: [],
  output: {},
};

if (dev) {
  config.devServer = {
    contentBase: join(__dirname, 'dist'),
    port: PORT,
    hot: true,
    inline: true,
    historyApiFallback: {
      verbose: true,
      disableDotRule: false,
    },
  };

  config.output.publicPath = `http://localhost:${PORT}/`;

  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

const appConfig = getConfig(config, {
  entry: {
    app: ['./src/renderer/views/app'],
    permissions: ['./src/renderer/views/permissions'],
    auth: ['./src/renderer/views/auth'],
    'form-fill': ['./src/renderer/views/form-fill'],
    credentials: ['./src/renderer/views/credentials'],
    find: ['./src/renderer/views/find'],

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

  plugins: [
    getHtml('app'),
    getHtml('permissions'),
    getHtml('auth'),
    getHtml('find'),
    getHtml('credentials'),
    getHtml('form-fill'),
    new HardSourceWebpackPlugin(),
  ],
});

if (dev) {
  appConfig.entry.app.unshift('react-hot-loader/patch');
  appConfig.entry.auth.unshift('react-hot-loader/patch');
  appConfig.entry.permissions.unshift('react-hot-loader/patch');
  appConfig.entry.find.unshift('react-hot-loader/patch');
  appConfig.entry.credentials.unshift('react-hot-loader/patch');
  appConfig.entry['form-fill'].unshift('react-hot-loader/patch');
}

module.exports = [appConfig];
