const path = require('path')
const webpack = require('webpack')

module.exports = {
  target: 'electron',
  devtool: 'eval-source-map',

  entry: {
    'app': './src/views/App'
  },

  node: {
    __dirname: false,
    __filename: false
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js'
  },

  devServer: {
    contentBase: './',
    publicPath: 'http://localhost:8080/build/'
  },

  module: {
    rules: [
      {
        test: /\.(scss)$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }, {
        test: /\.(png|gif|jpg|woff2|tff)$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'url-loader'
          }
        ]
      }, {
        test: /\.(js)$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'stage-0']
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ],

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js']
  }
}
