/* eslint-disable */
const { getConfig, dev } = require('./webpack.config.base');
const { spawn } = require('child_process');
const CopyPlugin = require('copy-webpack-plugin');
/* eslint-enable */

let electronProcess;

const mainConfig = getConfig({
  target: 'electron-main',

  watch: dev,

  entry: {
    main: './src/main',
  },

  plugins: [
    new CopyPlugin([
      {
        from: 'node_modules/@cliqz/adblocker-electron/dist/cjs/preload.js',
        to: 'preload.js',
      },
      {
        from:
          'node_modules/electron-extensions/build/background-preload.bundle.js',
        to: 'extensions-background-preload.js',
      },
      {
        from:
          'node_modules/electron-extensions/build/content-preload.bundle.js',
        to: 'extensions-content-preload.js',
      },
      {
        from: 'node_modules/mouse-hooks/mouse.js',
        to: 'mouse.js',
      },
    ]),
  ],
});

const preloadConfig = getConfig({
  target: 'electron-renderer',

  watch: dev,

  entry: {
    'view-preload': './src/preloads/view-preload',
  },

  plugins: [],
});

/*if (dev) {
  mainConfig.plugins.push({
    apply: compiler => {
      compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
        if (electronProcess) {
          electronProcess.kill();
        }

        electronProcess = spawn('npm', ['start'], {
          shell: true,
          env: process.env,
          stdio: 'inherit',
        })
          .on('close', code => process.exit(code))
          .on('error', spawnError => console.error(spawnError));
      });
    },
  });
}
*/
module.exports = [mainConfig, preloadConfig];
