const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require('./webpack.config.renderer.dev');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  contentBase: './static/pages',
  hot: true,
  historyApiFallback: true,
}).listen(8080, 'localhost', (err, result) => {
  if (err) {
    return console.log(err);
  }

  return console.log('Listening at http://localhost:8080/');
});
