const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

module.exports = merge.smart(baseConfig, {
  devtool: 'cheap-module-source-map',
  target: 'electron-main',
  mode: 'production',
  entry: './src/main',

  output: {
    path: __dirname,
    filename: 'main.js',
  },
});
