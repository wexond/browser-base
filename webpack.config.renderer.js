const webpack = require('webpack');
const { getConfig, dev } = require('./webpack.config.base');
const { join } = require('path');
const { execSync } = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const PORT = 4444;

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
    runtimeChunk: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Wexond',
      template: 'static/pages/app.html',
      filename: 'app.html',
    }),
    new HardSourceWebpackPlugin(),
  ],
});

if (dev) {
  appConfig.entry.app.unshift('react-hot-loader/patch');
}

module.exports = [appConfig];
