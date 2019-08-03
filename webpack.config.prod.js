const getConfig = require('./webpack.config.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appConfig = getConfig({
  target: 'electron-renderer',

  devtool: 'source-map',

  mode: 'production',

  output,

  entry: {
    app: ['./src/renderer/views/app'],
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
