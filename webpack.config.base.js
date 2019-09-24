/* eslint-disable */
const { resolve, join } = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
/* eslint-enable */

const INCLUDE = resolve(__dirname, 'src');

const dev = process.env.ENV === 'dev';

const styledComponentsTransformer = createStyledComponentsTransformer({ minify: true, displayName: dev });

const config = {
  mode: dev ? 'development' : 'production',

  devtool: dev ? 'eval-source-map' : 'source-map',

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
        use: ['file-loader'],
      },
      {
        test: /\.tsx|ts$/,
        use: [
          'cache-loader',
          {
            loader: 'ts-loader',
            options: {
              experimentalWatchApi: true,
              transpileOnly: true,
              getCustomTransformers: () => ({
                before: [styledComponentsTransformer],
              }),
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
    'electron-extensions',
    'keytar',
    '@cliqz/adblocker-electron',
  ],
};

function getConfig(...cfg) {
  return merge(config, ...cfg);
}

const getHtml = (scope, name) => {
  return new HtmlWebpackPlugin({
    title: 'Wexond',
    template: 'static/pages/app.html',
    filename: `${name}.html`,
    chunks: [`vendor.${scope}`, name],
  });
};

const applyEntries = (scope, config, entries) => {
  for (const entry of entries) {
    config.entry[entry] = [`./src/renderer/views/${entry}`];
    config.plugins.push(getHtml(scope, entry));

    if (dev) {
      config.entry[entry].unshift('react-hot-loader/patch');
    }
  }
};

const getBaseConfig = name => {
  const config = {
    plugins: [new HardSourceWebpackPlugin()],

    output: {},
    entry: {},

    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'initial',
            name: `vendor.${name}`,
            test: `vendor.${name}`,
            enforce: true,
          },
        },
      },
    },
  };

  config.entry[`vendor.${name}`] = [
    'react',
    'react-dom',
    'mobx',
    'mobx-react-lite',
    'styled-components',
  ];

  return config;
};

module.exports = { getConfig, dev, getHtml, applyEntries, getBaseConfig };
