import gulp from 'gulp';
import webpack from 'webpack';

import config from '../webpack/webpack.config.prod';

/**
 * Compile as minified library
 */
gulp.task('release', (done) => {
  const bundler = webpack(config);
  bundler.run((err, stats) => {
    console.log(stats.toString(config.stats));
    done(err);
  });
});
