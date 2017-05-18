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
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};

/**
 * Generate a webpack configuration
 * @param o - options
 */
function configure(o) {
  const files = [
    '../src/index.js',
  ];
  const DEBUG = o.environment !== 'production';
  const publicPath = o.publicPath || '/release/';
  const env = o.environment || (DEBUG ? 'development' : 'production');

  const hotPlugins = o.hot ? plugins.hot : () => [];

  const config = {
    context: __dirname,
    resolve: {
      extensions: ['.json', '.js', '.jsx'],
    },
    entry: {
      dataparser: files,
      'dataparser-with-locales': files.concat('../src/modules/contexts/index.js'),
      demo: o.hot ? [
        'webpack-hot-middleware/client?http://localhost:3000',
        '../demo/index.js',
      ] : [
        '../demo/index.js',
      ],
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
    ].concat(plugins[env]()).concat(hotPlugins()),
    module: {
      noParse: [
        // Suppress warnings and errors logged by benchmark.js when bundled using webpack.
        // https://github.com/bestiejs/benchmark.js/issues/106
        /benchmark/,
      ],
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
        {
          test: /\.less$/,
          use: [{
            loader: 'style-loader',
          }, {
            loader: 'css-loader',
            query: { sourceMap: true },
          }, {
            loader: 'less-loader',
            query: { sourceMap: true },
          }],
          exclude: /node_modules/,
        },
        {
          test: /\.woff(\?.*)?$/,
          use: 'url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff',
        },
        {
          test: /\.woff2(\?.*)?$/,
          use: 'url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff',
        },
        {
          test: /\.ttf(\?.*)?$/,
          use: 'url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream',
        },
        {
          test: /\.otf(\?.*)?$/,
          use: 'url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream',
        },
        {
          test: /\.eot(\?.*)?$/,
          use: 'file-loader?name=fonts/[name].[ext]',
        },
        {
          test: /\.svg(\?.*)?$/,
          use: 'url-loader?name=svg/[name].[ext]&limit=10000&mimetype=image/svg+xml',
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
