var path = require('path');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

module.exports = {
  entry: path.resolve(__dirname, 'app/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
      loaders: [
          {
              test: /\.jsx?$/,
              loader: 'babel-loader',
              exclude: [node_modules_dir],
              query: {
                  presets: ['es2015', 'react', 'stage-0', 'stage-1']
              }
          },
          {
              test: /\.scss$/,
              loader: 'style!css!sass'
          }
      ]
  }
};
