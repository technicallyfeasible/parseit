require('babel-core/register');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const webpack = require('webpack');

const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const src = {
  serverFiles: ['./src/**/*.js', './index.js'],
  testFiles: ['./test/**/*.spec.js'],
};

var devApp;

// The default task
gulp.task('default', ['watch']);

process.on('uncaughtException', function onProcessException(err) {
  $.util.log('Error:', err);
});

// start the server and restart if the source changes
gulp.task('test', function runTest() {
  return gulp.src(src.testFiles)
    .pipe($.cached('testing', { optimizeMemory: true }))
    .pipe($.mocha({ reporter: 'dot' }))
    .once('error', function handleTestError(err) {
      $.util.log(err);
      this.emit('end');
    });
});

// watch server and test files and restart tests when any change
gulp.task('watch', ['test'], function runWatch() {
  // rerun test task when files change
  gulp.watch(src.testFiles, ['test']);
  // rerun tests also when server files change but then run all tests and reset cache before
  gulp.watch(src.serverFiles, ['test'])
    .on('change', function handleChange() {
      $.util.log('Clear test file cache');
      delete $.cached.caches.testing;
    });
});

/**
 * Development mode with watching and hot reload
 */
gulp.task('dev', function runDebug() {
  const config = require('./webpack/webpack.config.dev.js');
  const bundler = webpack(config);

  devApp = express();
  devApp.use(webpackDevMiddleware(bundler, {
    lazy: false,
    noInfo: false,
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
  devApp.use('/', express.static(__dirname));
  const server = devApp.listen(3000, function serverStarted() {
    console.log('http://localhost:' + server.address().port + '/');
  });
});

/**
 * Compile as non-minified library
 */
gulp.task('debug', function runDebug(done) {
  const config = require('./webpack/webpack.config.js');
  const bundler = webpack(config);
  bundler.run(function handleResult(err, stats) {
    $.util.log(stats.toString({
      colors: true,
      chunks: false,
      modules: false,
    }));
    done(err);
  });
});

/**
 * Compile as minified library
 */
gulp.task('release', function runRelease(done) {
  const config = require('./webpack/webpack.config.prod.js');
  const bundler = webpack(config);
  bundler.run(function handleResult(err, stats) {
    $.util.log(stats.toString({
      colors: true,
      chunks: false,
      modules: false,
    }));
    done(err);
  });
});

gulp.task('build', ['debug', 'release']);
