const getConfig = require('./webpack.config.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');

execSync('npm run build-dll-dev');

const appConfig = getConfig({
  target: 'electron-renderer',

  devtool: 'source-map',

  mode: 'production',

  entry: {
    app: ['./src/renderer/views/app'],
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
