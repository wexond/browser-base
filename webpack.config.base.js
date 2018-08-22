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
      '@mixins': join(__dirname, './src/renderer/mixins'),
      '@components': join(__dirname, './src/renderer/components'),
      '~': join(__dirname, './src'),
    },
  },
};
