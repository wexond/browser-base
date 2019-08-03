const getConfig = require('./webpack.config.base');

const mainConfig = getConfig({
  target: 'electron-main',

  mode: 'production',

  entry: {
    main: './src/main',
  },
});

module.exports = [mainConfig];
