const webpack = require('webpack');
const argv = require('minimist')(process.argv.slice(2));

const DEBUG = !argv.release;

const config = {
  resolve: {
    extensions: ['.json', '.js'],
  },
  entry: './index.js',
  output: {
    path: './release/',
    publicPath: '/release/',
    filename: 'dataparser' + (DEBUG ? '' : '.min') + '.js',
    library: 'DataParser',
    libraryTarget: 'umd',
  },

  cache: DEBUG,
  debug: DEBUG,
  devtool: DEBUG ? '#inline-source-map' : false,
  stats: {
    colors: true,
    reasons: DEBUG,
  },

  plugins: DEBUG ? [
    new webpack.DefinePlugin({
      '__DEV__': true,
      '__SERVER__': false,
    }),
  ] : [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      '__DEV__': false,
      '__SERVER__': false,
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        'drop_console': true,
      },
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style!css',
    }, {
      test: /\.js/,
      loader: 'babel',
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }],
  },
};

module.exports = config;
