const webpack = require('webpack');

function configure(options) {
  const o = Object.assign({
    DEBUG: true,
  }, options);


  const config = {
    resolve: {
      extensions: ['.json', '.js'],
    },
    entry: './index',
    output: {
      path: './release/',
      publicPath: '/release/',
      filename: 'dataparser' + (o.DEBUG ? '' : '.min') + '.js',
      library: 'DataParser',
      libraryTarget: 'umd',
    },

    cache: o.DEBUG,
    DEBUG: o.DEBUG,
    devtool: o.DEBUG ? '#inline-source-map' : false,
    stats: {
      colors: true,
      reasons: o.DEBUG,
    },

    plugins: o.DEBUG ? [
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

  return config;
}

module.exports = configure;
