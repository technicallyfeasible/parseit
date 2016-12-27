const path = require('path');
const webpack = require('webpack');

/**
 * Generate a webpack configuration
 * @param o - options
 */
function configure(o) {
  const DEBUG = o.environment !== 'production';
  const publicPath = o.publicPath || '/release/';

  const config = {
    context: __dirname,
    resolve: {
      extensions: ['', '.json', '.js'],
    },
    entry: o.hot ? [
      'webpack-hot-middleware/client?http://localhost:3000',
      './index',
    ] : [
      './index'
    ],
    output: {
      path: path.join(__dirname, 'release/'),
      publicPath: publicPath,
      filename: 'dataparser' + (DEBUG ? '' : '.min') + '.js',
      library: 'DataParser',
      libraryTarget: 'umd',
    },

    cache: DEBUG,
    debug: DEBUG,
    devtool: DEBUG ? '#inline-source-map' : false,

    plugins: DEBUG ? [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"' + (o.environment || 'development') + '"',
      }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ] : [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"' + (o.environment || 'production') + '"',
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
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      }],
    },
  };

  return config;
}

module.exports = configure;
