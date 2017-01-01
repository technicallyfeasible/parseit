const path = require('path');
const webpack = require('webpack');

const babelOptions = require('./babelrc.prod');

const watcher = {
  aggregateTimeout: 300,
  poll: false,
  ignore: /node_modules/,
};

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
      extensions: ['.json', '.js', '.jsx'],
    },
    entry: o.hot ? [
      'webpack-hot-middleware/client?http://localhost:3000',
      '../index.js',
    ] : [
      '../index.js',
    ],
    output: {
      path: path.join(__dirname, '..', 'release/'),
      publicPath,
      filename: `dataparser${DEBUG ? '' : '.min'}.js`,
      library: 'DataParser',
      libraryTarget: 'umd',
      pathinfo: DEBUG,
    },

    cache: DEBUG,
    devtool: '#source-map',

    plugins: DEBUG ? [
      new webpack.LoaderOptionsPlugin({
        debug: true,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': `"${o.environment || 'development'}"`,
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ] : [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': `"${o.environment || 'production'}"`,
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          drop_console: true,
        },
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
    ],
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            quiet: true,
          },
        },
        {
          test: /\.jsx?$/,
          use: [{
            loader: 'babel-loader',
            options: babelOptions,
          }],
          exclude: /node_modules/,
        },
      ],
    },
  };

  return config;
}

module.exports = {
  default: configure,
  watcher,
};
