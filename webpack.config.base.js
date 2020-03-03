/* eslint-disable */
const { resolve, join } = require('path');
const { writeFileSync, readFileSync, existsSync } = require('fs');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const createStyledComponentsTransformer = require('typescript-plugin-styled-components')
  .default;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
/* eslint-enable */

const INCLUDE = resolve(__dirname, 'src');

const dev = process.env.ENV === 'dev';
const prebuild = process.env.PREBUILD === '1';

const CHUNKS_ENTRIES_MAP_PATH = 'chunks-entries-map.json';

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
  },

  module: {
    rules: [
      {
        test: /\.(png|gif|jpg|woff2|ttf|svg)$/,
        include: INCLUDE,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
            },
          },
        ],
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
      /*{
        test: /\.node$/,
        loader: 'awesome-node-loader',
        options: {
          name: '[contenthash].[ext]',
        },
      },*/
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

  externals: {
    keytar: `require('keytar')`,
  },

  optimization: {
    minimizer:
      !dev && !prebuild
        ? [
          new TerserPlugin({
            extractComments: true,
            terserOptions: {
              ecma: 8,
              output: {
                comments: false,
              },
            },
            parallel: true,
            cache: true,
          }),
        ]
        : [],
  },
};

if (dev) {
  config.plugins.push(new ForkTsCheckerWebpackPlugin());
  config.plugins.push(new HardSourceWebpackPlugin());
}

function getConfig(...cfg) {
  return merge(config, ...cfg);
}

const chunksEntriesMap =
  prebuild || !existsSync(CHUNKS_ENTRIES_MAP_PATH)
    ? {}
    : JSON.parse(readFileSync(CHUNKS_ENTRIES_MAP_PATH, 'utf8'));

const getHtml = (scope, name, entries = []) => {
  return new HtmlWebpackPlugin({
    title: 'Wexond',
    template: 'static/pages/app.html',
    filename: `${name}.html`,
    excludeChunks: entries
      .filter(x => x !== name)
      .concat(
        Object.entries(chunksEntriesMap)
          .filter(x => !x[1].includes(name))
          .map(x => x[0]),
      ),
  });
};

const applyEntries = (scope, config, entries) => {
  for (const entry of entries) {
    config.entry[entry] = [`./src/renderer/views/${entry}`];
    if (!prebuild) {
      config.plugins.push(getHtml(scope, entry, entries));
    }

    if (dev) {
      config.entry[entry].unshift('react-hot-loader/patch');
    }
  }
};

let printed = false;

const getBaseConfig = name => {
  const config = {
    plugins: [],

    output: {},

    entry: {},

    optimization: {
      runtimeChunk: {
        name: `runtime.${name}`,
      },
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              if (!printed) {
                printed = true;
              }

              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
              )[1];

              const bundleName = `npm.${packageName}.${name}`;

              chunksEntriesMap[bundleName] = Array.from(module._chunks).map(
                x => x.name,
              );
              writeFileSync(
                CHUNKS_ENTRIES_MAP_PATH,
                JSON.stringify(chunksEntriesMap),
              );

              return bundleName;
            },
          },
        },
      },
    },
  };

  if (prebuild) {
    config.plugins.push({
      apply: compiler => {
        compiler.hooks.compilation.tap('Compilation', compilation => {
          compilation.hooks.afterOptimizeChunkAssets.tap(
            'AfterOptimizeChunkAssets',
            chunks => {
              for (const chunk of chunks) {
                if (chunk.name.indexOf('~') !== -1) {
                  chunksEntriesMap[chunk.name] = chunk.name
                    .split('.')[0]
                    .split('~');
                }
              }

              writeFileSync(
                CHUNKS_ENTRIES_MAP_PATH,
                JSON.stringify(chunksEntriesMap),
              );
            },
          );
        });
      },
    });
  }

  return config;
};

module.exports = { getConfig, dev, getHtml, applyEntries, getBaseConfig };
