const { join } = require('path')
const webpack = require('webpack')
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin')

const productionDevtool = 'source-map'
const developmentDevtool = 'eval-source-map'

let config = {
  devtool: (process.env.NODE_ENV === 'production') ? productionDevtool : developmentDevtool,

  devServer: {
    contentBase: './',
    publicPath: 'http://localhost:8080/build/'
  },

  output: {
    path: join(__dirname, 'public', 'build'),
    filename: '[name].bundle.js'
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
        test: /\.(png|gif|jpg|woff2|ttf|svg)$/,
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
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }))
}

let appConfig = {
  target: 'electron-renderer',
  devtool,

  entry: {
    app: './src/bootstraps/app.jsx'
  }
}

let appletsConfig = {
  target: 'web',
  devtool,

  entry: {
    history: './src/bootstraps/history.jsx',
    newTab: './src/bootstraps/new-tab.jsx',
    settings: './src/bootstraps/settings.jsx'
  }
}

appConfig = Object.assign(appConfig, config)
appletsConfig = Object.assign(appletsConfig, config)

module.exports = [appConfig, appletsConfig]
