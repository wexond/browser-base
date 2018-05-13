const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');

const PORT = 8080;

const config = Object.assign(
  {
    devtool: 'source-map',

    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
  },
  baseConfig,
);

const appConfig = {
  target: 'electron-renderer',

  entry: {
    app: ['./src/app'],
  },

  externals: {
    sqlite3: 'commonjs sqlite3',
    npm: 'require("npm")',
  },
};

module.exports = [getConfig(appConfig)];

function getConfig(cfg) {
  return Object.assign({}, config, cfg);
}
