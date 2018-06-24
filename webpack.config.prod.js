const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');

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

const newTabConfig = {
  target: 'web',

  entry: {
    newtab: ['react-hot-loader/patch', './src/newtab'],
  },
};

const testFieldConfig = {
  target: 'web',

  entry: {
    testField: ['react-hot-loader/patch', './src/test-field'],
  },
};

function getConfig(cfg) {
  return Object.assign({}, config, cfg);
}

module.exports = [getConfig(appConfig), getConfig(newTabConfig), getConfig(testFieldConfig)];
