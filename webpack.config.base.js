const { resolve } = require('path');
const merge = require('webpack-merge');

const INCLUDE = resolve(__dirname, 'src');
const EXCLUDE = /node_modules/;

const config = {
  output: {
    path: resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.(png|gif|jpg|woff2|ttf|svg)$/,
        include: INCLUDE,
        exclude: EXCLUDE,
        use: ['url-loader'],
      },
      {
        test: /\.(tsx|ts)$/,
        include: INCLUDE,
        exclude: EXCLUDE,
        use: ['ts-loader'],
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

  externals: {
    'extract-file-icon': 'require("extract-file-icon")',
    'mouse-hooks': 'require("mouse-hooks")',
    'node-window-manager': 'require("node-window-manager")',
    'node-vibrant': 'require("node-vibrant")',
    leveldown: 'require("leveldown")',
  },
};

function getConfig(...cfg) {
  return merge(config, ...cfg);
}

module.exports = getConfig;
