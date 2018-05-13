const webpack = require('webpack');
const { spawn } = require('child_process');
const baseConfig = require('./webpack.config.base');

const PORT = 8080;

const config = Object.assign(
  {
    devtool: 'eval-source-map',

    output: {
      publicPath: `http://localhost:${PORT}/`,
      hotUpdateChunkFilename: 'hot/hot-update.js',
      hotUpdateMainFilename: 'hot/hot-update.json',
    },

    plugins: [new webpack.HotModuleReplacementPlugin()],
  },
  baseConfig,
);

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

module.exports = [getConfig(appConfig)];

function getConfig(cfg) {
  return Object.assign({}, config, cfg);
}
