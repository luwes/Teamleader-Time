
var fs = require('fs');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = {
		sass: 'app/sass/**/*',
		js: 'app/src/**/*'
};

gulp.task('sass', function() {
	return gulp.src(paths.sass)
		.pipe($.sass())
		.pipe($.autoprefixer())
		.pipe(gulp.dest('app/css'));
});

gulp.task('watch', function() {
	gulp.watch(paths.sass, ['sass']);
	return gulp.watch(paths.js, ['js']);
});


/**
 * Build javascript
 */

var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

gulp.task("js", function(callback) {
	webpack(webpackConfig, function(err, stats) {
	  if(err) throw new $.util.PluginError("webpack", err);
	  $.util.log("[webpack]", stats.toString({
	  	colors: true
	  }));
	  callback();
	});
});


/**
 * NwBuilder stuff
 */

var NwBuilder = require('nw-builder');

var nwOptions = {
	appName: 'Teamleader Time',
	appDir: './app',
	files: './app/**/**', // use the glob format
	platforms: [ 'osx' ],
	buildDir: './dist',
	buildType: 'versioned',
	version: 'v0.12.2'
};

/**
 * Runs the app
 */
gulp.task('run', run);
function run() {

	var nw = new NwBuilder(nwOptions);

	//Log stuff you want
	nw.on('log',  $.util.log);

	setDevMode(true);

	// Build returns a promise
	nw.run().then(function () {
		console.log('all done!');
	}).catch(function (error) {
		console.error(error);
	});
}

/**
 * Builds the app
 */
gulp.task('build', function() {

	var nw = new NwBuilder(nwOptions);

	//Log stuff you want
	nw.on('log',  $.util.log);

	setDevMode(false);

	// Build returns a promise
	nw.build().then(function () {
		console.log('all done!');
	}).catch(function (error) {
		console.error(error);
	});
});

/**
 * Toggles dev mode
 * @param enable
 */
function setDevMode(enable)
{
    fs.writeFile('app/.dev', enable ? '1' : '0');
}

gulp.task('default', ['sass', 'js', 'watch'], run);
