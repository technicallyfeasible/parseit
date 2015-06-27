'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var src = {
	serverFiles: ['./src/**/*.js', './index.js'],
	testFiles: ['./test/**/*.spec.js']
};


// The default task
gulp.task('default', ['watch']);

gulp.task('lint', function () {
	return gulp.src(src.serverFiles.concat(src.testFiles))
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
	$.util.log('Running tests.');
	return gulp.src(src.testFiles)
		.pipe($.mocha({reporter: 'spec'}))
		.once('error', function (err) {
			$.util.log(err);
			this.emit('end');
		});
});

// watch server and test files and restart tests when any change
gulp.task('watch', ['test'], function (cb) {

	gulp.watch(src.serverFiles.concat(src.testFiles), ['test']);

});

