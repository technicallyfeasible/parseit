const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
require('babel-core/register');

const src = {
  serverFiles: ['./src/**/*.js', './index.js'],
  testFiles: ['./test/**/*.spec.js'],
};

// The default task
gulp.task('default', ['watch']);

// start the server and restart if the source changes
gulp.task('test', function runTest() {
  $.util.log('Running tests.');
  return gulp.src(src.testFiles)
    .pipe($.cached('testing', { optimizeMemory: true }))
    .pipe($.mocha({ reporter: 'spec' }))
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
