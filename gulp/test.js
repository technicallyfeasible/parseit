import path from 'path';
import gulp from 'gulp';
import webpack from 'webpack';
import Mocha from 'mocha';

import webpackConfig from '../webpack/webpack.config.test';

const file = path.join(__dirname, '../release/dataparser.test.js');


function buildTestBundle(watch) {
  const bundler = webpack(webpackConfig.default);

  const mocha = new Mocha();
  mocha.addFile(file);

  function bundleReady(err, stats) {
    if (err) {
      console.error(err);
      return;
    }

    console.log('[webpack]', stats.toString(webpackConfig.default.stats));

    try {
      console.log('Starting tests...');

      mocha.run(failures => {
        if (!watch) {
          process.on('exit', () => {
            // exit with non-zero status if there were failures
            process.exit(failures);
          });
        }
      });

      console.log('Done.');
    } catch (e) {
      console.log('Error loading module:', e.stack);
    }
  }

  if (watch) {
    bundler.watch(webpackConfig.watcher, bundleReady);
  } else {
    bundler.run(bundleReady);
  }
}

gulp.task('test-dev', () => {
  buildTestBundle(true);
});

gulp.task('test', () => {
  buildTestBundle();
});
