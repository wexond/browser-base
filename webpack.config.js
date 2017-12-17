const { join } = require('path')
const webpack = require('webpack')
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin')

let config = {
  devServer: {
    contentBase: './',
    publicPath: 'http://localhost:8080/build/'
  },

  module: {
    rules: [
      {
        test: /\.(scss)$/,
        include: join(__dirname, 'src'),
        exclude: /node_modules/,
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
        test: /\.(png|gif|jpg|woff2|tff|svg)$/,
        include: join(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader'
          }
        ]
      }, {
        test: /\.(jsx|js)$/,
        include: join(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },

  plugins: [],

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx']
  }
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new UglifyJSWebpackPlugin({
    uglifyOptions: {
      output: {
        comments: false
      }
    }
  }))
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }))
  config.devtool = 'cheap-module-source-map'
}

let appConfig = {
  target: 'electron',
  devtool: 'eval-source-map',
  output: {
    path: join(__dirname, 'public', 'app', 'build'),
    filename: '[name].bundle.js'
  },

  entry: {
    app: './src/app-bootstrap.jsx'
  }
}

let historyConfig = {
  target: 'web',
  devtool: 'eval-source-map',

  output: {
    path: join(__dirname, 'public', 'history', 'build'),
    filename: '[name].bundle.js'
  },

  entry: {
    history: './src/history-bootstrap.jsx'
  }
}

appConfig = Object.assign(appConfig, config)
historyConfig = Object.assign(historyConfig, config)

module.exports = [appConfig, historyConfig]
