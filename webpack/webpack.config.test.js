'use strict';

const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

const utils = require('./webpack.utils');
const babelOptions = require('./babelrc.test');

const nodeModules = utils.getNodeModules();

const watcher = {
  aggregateTimeout: 300,
  poll: false,
  ignore: /node_modules/,
};

const config = {
  resolve: {
    extensions: ['.json', '.js', '.jsx'],
  },
  entry: {
    'dataparser.test': [
      './test/init.js',
    ].concat(glob.sync('test/**/*.spec.js').map(file => `./${file}`)),
  },
  target: 'node',
  output: {
    path: path.join(__dirname, '..', 'release/'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    pathinfo: true,
  },
  externals: {
    ...nodeModules,
    dataparser: true,
  },
  cache: true,
  devtool: '#inline-source-map',
  stats: {
    colors: true,
    chunks: false,
    modules: false,
    reasons: false,
  },
  performance: {
    hints: false,
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'testing'),
    }),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),
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

module.exports = {
  default: config,
  watcher,
};
