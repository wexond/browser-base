const webpack = require('webpack');
const merge = require('webpack-merge');
const { resolve } = require('path');
const baseConfig = require('./webpack.config.base');

const PORT = 8080;

const appConfig = merge.smart(baseConfig, {
  devtool: 'eval-source-map',
  target: 'electron-renderer',
  mode: 'development',

  entry: {
    app: ['react-hot-loader/patch', './src/renderer/views/app'],
  },

  output: {
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json',
    publicPath: `http://localhost:${PORT}/`,
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

  plugins: [new webpack.HotModuleReplacementPlugin()],

  devServer: {
    contentBase: './static/pages',
    port: PORT,
    stats: {
      colors: true,
    },
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100,
    },
    hot: true,
    inline: true,
  },
});

const newTabConfig = merge.smart(baseConfig, {
  target: 'web',
  mode: 'development',

  output: {
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json',
    publicPath: `http://localhost:${PORT}/`,
    path: resolve(__dirname, 'build'),
    filename: '[name].js',
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],

  module: {
    rules: [
      {
        test: /\.(png|gif|jpg|woff2|ttf|svg)$/,
        use: ['url-loader'],
      },
    ],
  },

  entry: {
    newtab: ['react-hot-loader/patch', './src/renderer/views/newtab'],
  },
});

module.exports = [appConfig, newTabConfig];
