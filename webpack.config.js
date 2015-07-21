
var path = require("path");
var webpack = require('webpack');

var packageJson = require('./package.json');
var vendors = Object.keys(packageJson && packageJson.dependencies || {});

var config = {
  cache: true,
  debug: true,
  entry: {
    vendors: vendors,
    app: './app/src/App.js'
  },
  output: {
    path: path.join(__dirname, "app/js"),
    filename: '[name].js'
  },
  module: {
    noParse: vendors,
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/, 
        loader: 'babel'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
  ]
};

module.exports = config;