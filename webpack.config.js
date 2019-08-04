const getConfig = require('./webpack.config.base');
const { spawn } = require('child_process');

let electronProcess;

const mainConfig = getConfig({
  target: 'electron-main',

  mode: 'development',

  watch: true,

  entry: {
    main: './src/main',
  },

  plugins: [
    {
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
    },
  ],
});

module.exports = [mainConfig];
