const path = require('path');
const webpack = require('webpack');

const babelOptions = require('./babelrc.prod');

const watcher = {
  aggregateTimeout: 300,
  poll: false,
  ignore: /node_modules/,
};

/**
 * Plugins by environment
 */
const plugins = {
  development: () => [
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
  ],
  production: () => [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_console: true,
      },
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
  hot: () => [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
};

/**
 * Generate a webpack configuration
 * @param o - options
 */
function configure(o) {
  const files = o.hot ? [
    'webpack-hot-middleware/client?http://localhost:3000',
    '../index.js',
  ] : [
    '../index.js',
  ];
  const DEBUG = o.environment !== 'production';
  const publicPath = o.publicPath || '/release/';
  const env = o.environment || (DEBUG ? 'development' : 'production');

  const hotPlugins = o.hot ? plugins.hot : [];

  const config = {
    context: __dirname,
    resolve: {
      extensions: ['.json', '.js', '.jsx'],
    },
    entry: {
      dataparser: files,
      'dataparser-with-locales': files.concat('../src/modules/contexts/index.js'),
    },
    output: {
      path: path.join(__dirname, '..', 'release/'),
      publicPath,
      filename: `[name]${DEBUG ? '' : '.min'}.js`,
      library: 'dataparser',
      libraryTarget: 'umd',
      pathinfo: DEBUG,
    },

    externals: {
      dataparser: true,
    },

    cache: DEBUG,
    devtool: '#source-map',

    stats: {
      colors: true,
      chunks: false,
      modules: false,
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
    ].concat(plugins[env]()).concat(hotPlugins),
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
