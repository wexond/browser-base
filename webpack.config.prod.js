const webpack = require('webpack');
const { resolve } = require('path');
const { spawn } = require('child_process');

const INCLUDE = resolve(__dirname, 'src');
const EXCLUDE = /node_modules/;

const config = {
  devtool: 'source-map',

  output: {
    path: resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.(png|gif|jpg|woff2|tff|svg)$/,
        include: INCLUDE,
        exclude: EXCLUDE,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
      {
        test: /\.(tsx|ts|jsx|js)$/,
        include: INCLUDE,
        exclude: EXCLUDE,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },

  node: {
    __dirname: false,
    __filename: false,
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.tsx', '.ts', '.json'],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};

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
