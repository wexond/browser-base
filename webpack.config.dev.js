const webpack = require('webpack');
const { spawn } = require('child_process');
const baseConfig = require('./webpack.config.base');
const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PORT = 4444;

const output = {
  publicPath: `http://localhost:${PORT}/`,
  hotUpdateChunkFilename: 'hot/hot-update.js',
  hotUpdateMainFilename: 'hot/hot-update.json',
};

const config = Object.assign({}, baseConfig, {
  devtool: 'eval-source-map',

  plugins: [new webpack.HotModuleReplacementPlugin()],
});

config.output = Object.assign(output, baseConfig.output);

const mainConfig = {
  target: 'electron-main',

  watch: true,

  entry: {
    main: './src/main',
  },

  plugins: [
    {
      apply: compiler => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', compilation => {
          spawn('npm', ['start'], {
            shell: true,
            env: process.env,
            stdio: 'inherit',
          })
            .on('close', code => process.exit(code))
            .on('error', spawnError => console.error(spawnError));
        });
      },
    },
  ],
};

const appConfig = {
  target: 'electron-renderer',

  entry: {
    app: ['react-hot-loader/patch', './src/renderer/views/app'],
  },

  devServer: {
    contentBase: join(__dirname, 'dist'),
    port: PORT,
    stats: 'errors-only',
    hot: true,
    inline: true,
    historyApiFallback: {
      verbose: true,
      disableDotRule: false,
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Wexond',
      template: 'static/pages/app.html',
    }),
  ],
};

function getConfig(cfg) {
  return Object.assign({}, config, cfg);
}

module.exports = [getConfig(mainConfig), getConfig(appConfig)];
