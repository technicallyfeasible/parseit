import gulp from 'gulp';
import webpack from 'webpack';

import config from '../webpack/webpack.config';

/**
 * Compile as non-minified library
 */
gulp.task('debug', (done) => {
  const bundler = webpack(config);
  bundler.run((err, stats) => {
    console.log(stats.toString(config.stats));
    done(err);
  });
});
