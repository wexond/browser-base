/* eslint-disable */
const { resolve, join } = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
/* eslint-enable */

const INCLUDE = resolve(__dirname, 'src');

const dev = process.env.ENV === 'dev';

const styledComponentsTransformer = createStyledComponentsTransformer({
  minify: true,
  displayName: dev,
});

const config = {
  mode: dev ? 'development' : 'production',

  devtool: dev ? 'eval-source-map' : 'none',

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
      {
        test: /\.node$/,
        loader: 'awesome-node-loader',
        options: {
          name: '[contenthash].[ext]',
        },
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

  plugins: [
    // new BundleAnalyzerPlugin()
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

  if (dev) {
    config.plugins.push(new ForkTsCheckerWebpackPlugin());
  }

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
