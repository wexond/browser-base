const { resolve } = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const INCLUDE = resolve(__dirname, 'src');

const config = {
  output: {
    path: resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
    libraryTarget: 'commonjs2',
  },

  module: {
    rules: [
      {
        test: /\.(png|gif|jpg|woff2|ttf|svg)$/,
        include: INCLUDE,
        use: ['url-loader'],
      },
      {
        test: /\.tsx|ts$/,
        use: [
          'cache-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],

        include: INCLUDE,
      },
    ],
  },

  node: {
    __dirname: false,
    __filename: false,
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.tsx', '.ts', '.json'],
    alias: {
      '~': INCLUDE,
    },
  },

  externals: [
    'extract-file-icon',
    'mouse-hooks',
    'node-window-manager',
    'node-vibrant',
    'leveldown',
  ],
};

function getConfig(...cfg) {
  return merge(config, ...cfg);
}

module.exports = getConfig;
