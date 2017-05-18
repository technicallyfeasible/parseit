import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlPluginRemove from 'html-webpack-plugin-remove'

const babelOptions = require('./babelrc.prod');

const watcher = {
  aggregateTimeout: 300,
  poll: false,
  ignore: /node_modules/,
};

const htmlConfig = {
  title: 'ParseIT Demo',
  filename: 'demo/index.html',
  template: '../assets/index.ejs',
  xhtml: true,
  inject: 'head',
};
const htmlRemove = /<script type="text\/javascript" src="\/dataparser[^"]*"><\/script>/g;

/**
 * Plugins by environment
 */
const plugins = {
  development: () => [
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new HtmlWebpackPlugin(htmlConfig),
    new HtmlPluginRemove(htmlRemove),
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
    new ExtractTextPlugin('demo/css/demo.css'),
    new HtmlWebpackPlugin(htmlConfig),
    new HtmlPluginRemove(htmlRemove),
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
  const publicPath = o.publicPath || '/';
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
      'demo/js/demo': o.hot ? [
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
          use: DEBUG ? [{
            loader: 'style-loader',
          }, {
            loader: 'css-loader',
            query: { sourceMap: true },
          }, {
            loader: 'less-loader',
            query: { sourceMap: true },
          }] : ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [{
              loader: 'css-loader',
              query: { sourceMap: true },
            }, {
              loader: 'less-loader',
              query: { sourceMap: true },
            }],
          }),
          exclude: /node_modules/,
        },
        {
          test: /\.woff(\?.*)?$/,
          use: 'file-loader?name=demo/fonts/[name].[ext]&mimetype=application/font-woff',
        },
        {
          test: /\.woff2(\?.*)?$/,
          use: 'file-loader?name=demo/fonts/[name].[ext]&mimetype=application/font-woff',
        },
        {
          test: /\.ttf(\?.*)?$/,
          use: 'file-loader?name=demo/fonts/[name].[ext]&mimetype=application/octet-stream',
        },
        {
          test: /\.otf(\?.*)?$/,
          use: 'file-loader?name=demo/fonts/[name].[ext]&mimetype=application/octet-stream',
        },
        {
          test: /\.eot(\?.*)?$/,
          use: 'file-loader?name=demo/fonts/[name].[ext]',
        },
        {
          test: /\.svg(\?.*)?$/,
          use: 'file-loader?name=demo/svg/[name].[ext]&mimetype=image/svg+xml',
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
