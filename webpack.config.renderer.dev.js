const webpack = require('webpack');
const merge = require('webpack-merge');
const { resolve } = require('path');
const baseConfig = require('./webpack.config.base');

const PORT = 8080;

module.exports = merge.smart(baseConfig, {
  devtool: 'eval-source-map',
  target: 'electron-renderer',
  mode: 'development',

  entry: {
    app: ['react-hot-loader/patch', './src/renderer/views/app'],
  },

  output: {
    publicPath: `http://localhost:${PORT}/`,
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json',
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

  plugins: [new webpack.HotModuleReplacementPlugin({ multiStep: true })],

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
    historyApiFallback: {
      verbose: true,
      disableDotRule: false,
    },
    hot: true,
    inline: true,
    lazy: false,
  },
});
