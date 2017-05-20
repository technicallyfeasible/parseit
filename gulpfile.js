require('babel-register');
const gulp = require('gulp');

require('./gulp/test');
require('./gulp/dev');
require('./gulp/debug');
require('./gulp/release');
require('./gulp/publish');


gulp.task('default', ['test']);
gulp.task('build', ['debug', 'release']);
