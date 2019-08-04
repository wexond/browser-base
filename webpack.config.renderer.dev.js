const webpack = require('webpack');
const getConfig = require('./webpack.config.base');
const { join } = require('path');
const { execSync } = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

execSync('npm run build-dll-dev');

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
  },

  externals: [
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

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Wexond',
      template: 'static/pages/app.html',
      filename: 'app.html',
    }),
    new webpack.DllReferencePlugin({
      context: './build',
      manifest: require('./build/vendor.json'),
      sourceType: 'var',
    }),
    new AddAssetHtmlPlugin({
      filepath: require.resolve('./build/vendor.bundle.js'),
    }),
  ],
});

module.exports = [appConfig];
