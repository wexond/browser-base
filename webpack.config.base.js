const { resolve } = require('path');

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
        test: /\.(tsx|ts|jsx|js)$/,
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
  },
};

module.exports = config;
