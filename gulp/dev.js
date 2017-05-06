import path from 'path';
import gulp from 'gulp';
import webpack from 'webpack';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from '../webpack/webpack.config.dev';

let devApp;

/**
 * Development mode with watching and hot reload
 */
gulp.task('dev', () => {
  const bundler = webpack(config);

  devApp = express();
  devApp.use(webpackDevMiddleware(bundler, {
    lazy: false,
    noInfo: false,
    hot: true,
    stats: {
      colors: true,
      chunks: false,
      modules: false,
      reasons: true,
    },
    watchOptions: {
      aggregateTimeout: 300,
    },
    publicPath: config.output.publicPath,
  }));
  devApp.use(webpackHotMiddleware(bundler));
  devApp.use('/', express.static(path.join(__dirname, '../assets')));
  const server = devApp.listen(3000, () => {
    console.log(`http://localhost:${server.address().port}/`);
  });
});
