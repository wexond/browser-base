const webpack = require('webpack');
const getConfig = require('./webpack.config.base');
const { join } = require('path');
const { spawn } = require('child_process');

let electronProcess;

const mainConfig = getConfig({
  target: 'electron-main',

  watch: true,

  entry: {
    main: './src/main',
  },

  plugins: [
    {
      apply: compiler => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', compilation => {
          if (electronProcess) {
            electronProcess.disconnect();
            electronProcess.kill();
          }

          electronProcess = spawn('npm', ['start'], {
            shell: true,
            env: process.env,
            stdio: 'inherit',
          })
            .on('close', code => process.exit(code))
            .on('error', spawnError => console.error(spawnError));

          electronProcess.unref();
        });
      },
    },
  ],
});

module.exports = [mainConfig];
