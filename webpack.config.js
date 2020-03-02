/* eslint-disable */
const { getConfig, dev } = require('./webpack.config.base');
const { spawn, execSync } = require('child_process');
const CopyPlugin = require('copy-webpack-plugin');
let terser = require('terser');
/* eslint-enable */

let electronProcess;

const mainConfig = getConfig({
  target: 'electron-main',

  devtool: dev ? 'inline-source-map' : 'none',

  watch: dev,

  entry: {
    main: './src/main',
  },

  plugins: [
    new CopyPlugin(
      [
        {
          from:
            'node_modules/@cliqz/adblocker-electron-preload/dist/preload.cjs.js',
          to: 'preload.js',
          transform: (fileContent, path) => {
            return terser.minify(fileContent.toString()).code.toString();
          },
        },
        {
          from: 'node_modules/electron-extensions/preload.js',
          to: 'extensions-preload.js',
        },
      ],
      { copyUnmodified: true },
    ),
  ],
});

const preloadConfig = getConfig({
  target: 'electron-renderer',

  watch: dev,

  entry: {
    'view-preload': './src/preloads/view-preload',
    'popup-preload': './src/preloads/popup-preload',
  },

  plugins: [],
});

if (process.env.START === '1') {
  mainConfig.plugins.push({
    apply: compiler => {
      compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
        if (electronProcess) {
          try {
            if (process.platform === 'win32') {
              execSync(`taskkill /pid ${electronProcess.pid} /f /t`);
            } else {
              electronProcess.kill();
            }

            electronProcess = null;
          } catch (e) {}
        }

        electronProcess = spawn('npm', ['start'], {
          shell: true,
          env: process.env,
          stdio: 'inherit',
        });
      });
    },
  });
}

module.exports = [mainConfig, preloadConfig];
