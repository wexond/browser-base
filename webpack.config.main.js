const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

module.exports = (env, argv) =>
  merge.smart(baseConfig, {
    devtool:
      argv.mode === 'development'
        ? 'eval-source-map'
        : 'cheap-module-source-map',
    target: 'electron-main',
    entry: './src/main',

    output: {
      path: __dirname,
      filename: 'main.js',
    },

    externals: {
      chokidar: 'require("chokidar")',
    },
  });
