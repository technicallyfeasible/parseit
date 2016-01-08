require('babel-core/register');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const webpack = require('webpack');
const configure = require('./webpack.config.js');

const src = {
  serverFiles: ['./src/**/*.js', './index.js'],
  testFiles: ['./test/**/*.spec.js'],
};

// The default task
gulp.task('default', ['watch']);

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

gulp.task('debug', function runDebug(done) {
  const config = configure({
    DEBUG: true,
  });
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

gulp.task('release', function runRelease(done) {
  const config = configure({
    DEBUG: false,
  });
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
