const { resolve } = require('path');
const merge = require('webpack-merge');

const INCLUDE = resolve(__dirname, 'src');
const EXCLUDE = /node_modules/;

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
        use: ['cache-loader', 'ts-loader'],
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
    extensions: ['.js', '.tsx', '.ts', '.json'],
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
    'electron-extensions',
  ],
};

function getConfig(...cfg) {
  return merge(config, ...cfg);
}

module.exports = getConfig;
