const { resolve, join } = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(tsx|ts|jsx|js)$/,
        include: resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: ['awesome-typescript-loader'],
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
    alias: {
      '@app': join(__dirname, './src/renderer/app'),
      '@newtab': join(__dirname, './src/renderer/newtab'),
      '@history': join(__dirname, './src/renderer/history'),
      '@about': join(__dirname, './src/renderer/about'),
      '@bookmarks': join(__dirname, './src/renderer/bookmarks'),
      '@': join(__dirname, './src/shared'),
      '~': join(__dirname, './src'),
    },
  },

  externals: {
    leveldown: 'require("leveldown")',
  },
};
