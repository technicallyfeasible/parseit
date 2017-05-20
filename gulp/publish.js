import gulp from 'gulp';
import babel from 'gulp-babel';

const paths = {
  src: ['src/**/*.js'],
  lib: 'release/lib',
};

/**
 * Babelify all files so they can be imported in nodejs
 */
gulp.task('publish', ['release'], () => {
  return gulp
    .src(paths.src)
    .pipe(babel())
    .pipe(gulp.dest(paths.lib));
});
