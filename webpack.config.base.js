const { resolve } = require('path');

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
      utils: './src/utils',
      constants: './src/constants',
      defaults: './src/defaults',
      models: './src/models',
      interfaces: './src/interfaces',
      enums: './src/enums',
    },
  },
};
