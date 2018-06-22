const webpack = require('webpack');
const { spawn } = require('child_process');
const baseConfig = require('./webpack.config.base');

const PORT = 8080;

const output = {
  publicPath: `http://localhost:${PORT}/`,
  hotUpdateChunkFilename: 'hot/hot-update.js',
  hotUpdateMainFilename: 'hot/hot-update.json',
};

const config = Object.assign(
  {
    devtool: 'eval-source-map',

    plugins: [new webpack.HotModuleReplacementPlugin()],
  },
  baseConfig,
);

config.output = Object.assign(output, baseConfig.output);

const appConfig = {
  target: 'electron-renderer',

  entry: {
    app: ['react-hot-loader/patch', './src/app'],
  },

  externals: {
    sqlite3: 'commonjs sqlite3',
    npm: 'require("npm")',
  },

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

const newTabConfig = {
  target: 'web',

  entry: {
    newtab: ['react-hot-loader/patch', './src/newtab'],
  },
};

module.exports = [getConfig(appConfig), getConfig(newTabConfig)];

function getConfig(cfg) {
  return Object.assign({}, config, cfg);
}
