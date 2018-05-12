const webpack = require('webpack');
const { resolve } = require('path');
const { spawn } = require('child_process');

const INCLUDE = resolve(__dirname, 'src');
const EXCLUDE = /node_modules/;

const PORT = 8080;

const config = {
  devtool: 'eval-source-map',

  output: {
    path: resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
    publicPath: `http://localhost:${PORT}/`,
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json',
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
            loader: 'awesome-typescript-loader',
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

  plugins: [new webpack.HotModuleReplacementPlugin()],

  devServer: {
    contentBase: './static/pages',
    port: PORT,
    stats: {
      colors: true,
    },
    hot: true,
    inline: true,
    after() {
      spawn('npm', ['start'], {
        shell: true,
        env: process.env,
        stdio: 'inherit',
        cwd: __dirname,
      }).on('close', () => process.exit(0));
    },
  },
};

const appConfig = {
  target: 'electron-renderer',
  entry: {
    app: ['react-hot-loader/patch', './src/app'],
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
