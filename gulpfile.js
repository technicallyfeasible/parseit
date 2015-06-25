'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var src = {};


// The default task
gulp.task('default', ['serve']);

gulp.task('lint', function () {
	return gulp.src(['./server/**/*.*'])
		// eslint() attaches the lint output to the eslint property
		// of the file object so it can be used by other modules.
		.pipe($.eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe($.eslint.format());
	// To have the process exit with an error code (1) on
	// lint error, return the stream and pipe to failOnError last.
	//.pipe($.eslint.failOnError());
});

// start the server and restart if the source changes
gulp.task('test', ['lint'], function () {
	src.testFiles = './test/**/*.spec.*';
	$.util.log('Running tests.');
	return gulp.src(src.testFiles)
		.pipe($.mocha({reporter: 'spec'}))
		.once('error', function (err) {
			$.util.log(err);
			this.emit('end');
		});
});

// start the server and restart if the source changes
gulp.task('serve', ['test'], function (cb) {
    src.serverFiles = './server/**/*.*';

    var started = false;
    var cp = require('child_process');
    var assign = require('lodash').assign;

    var server = (function startup() {
        var child = cp.fork('./server/server.js', {
            env: assign({
                NODE_ENV: 'development'
            }, process.env)
        });
        child.once('message', function (message) {
            if (message.match(/^online$/)) {
                if (!started) {
                    started = true;
                    gulp.watch([src.serverFiles, src.testFiles], ['test', function () {
                        $.util.log('Restarting development server.');
                        server.kill('SIGTERM');
                        server = startup();
                    }]);
                    cb();
                }
            }
        });
        return child;
    })();

    process.on('exit', function () {
		$.util.log('server dying');
        server.kill('SIGTERM');
    });
});

