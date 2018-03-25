const webpack = require('webpack');
const { resolve } = require('path');
const { spawn } = require('child_process');

const productionDevtool = 'source-map';
const developmentDevtool = 'eval-source-map';

const INCLUDE = [resolve(__dirname, 'src')];
const EXCLUDE = [/node_modules/];

const PORT = 8080;

const OUTPUT_DIR = resolve(__dirname, 'build');

const config = {
  devtool: process.env.NODE_ENV === 'production' ? productionDevtool : developmentDevtool,

  output: {
    path: OUTPUT_DIR,
    filename: '[name].bundle.js',
    publicPath: 'http://localhost:8080/',
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
    extensions: ['.js', '.tsx', '.ts'],
  },

  devServer: {
    contentBase: OUTPUT_DIR,
    publicPath: '/',
    port: PORT,
    stats: {
      colors: true,
    },
    after() {
      spawn('npm', ['start'], {
        shell: true,
        env: process.env,
        stdio: 'inherit',
        cwd: __dirname,
      }).on('close', () => process.exit(0));
    },
  },

  externals: {
    vm2: 'require("vm2")',
  },

  plugins: [],
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }));
}

let appConfig = {
  target: 'electron-renderer',
  entry: {
    app: './src/app',
  },
};

appConfig = Object.assign(appConfig, config);

module.exports = [appConfig];
