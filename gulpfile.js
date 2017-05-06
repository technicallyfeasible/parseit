require('babel-register');
const gulp = require('gulp');

require('./gulp/test');
require('./gulp/dev');
require('./gulp/debug');
require('./gulp/release');


gulp.task('default', ['test']);
gulp.task('build', ['debug', 'release']);
