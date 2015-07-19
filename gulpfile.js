
var fs = require('fs');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var NwBuilder = require('nw-builder');
var minimist = require('minimist');

var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require("browserify");
var babelify = require("babelify");

var paths = {
		sass: 'app/sass/**/*',
		js: 'app/src/app.js'
};

var packageJson = require('./package.json');
var dependencies = Object.keys(packageJson && packageJson.dependencies || {});

gulp.task('sass', function() {
	return gulp.src(paths.sass)
		.pipe($.sass())
		.pipe($.autoprefixer())
		.pipe(gulp.dest('app/css'));
});

/**
 * Bundle libraries
 */
var b1 = browserify({
	debug: true,
	extensions: [ '.jsx' ],
});
b1.require(dependencies);

// The global true flag below does all the good stuff
// See: https://github.com/thlorenz/browserify-shim/issues/134
b1.transform('browserify-shim', {
	global: true
});

gulp.task('libjs', bundle1); // so you can run `gulp js` to build the file
b1.on('log', $.util.log); // output build logs to terminal

function bundle1() {
	return b1.bundle()
		// log errors if they happen
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('lib.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
		.pipe($.uglify())
		.pipe(gulp.dest('app/js'));
}

/**
 * Bundle app
 */
var b2 = watchify(browserify({
	entries: paths.js,
	debug: true,
	extensions: [ '.jsx' ],
}));
b2.external(dependencies);

// add transformations here
// i.e. b.transform(coffeeify);
b2.transform(babelify.configure({
	ignore: /(bower_components)|(node_modules)/
}));

gulp.task('appjs', bundle2); // so you can run `gulp js` to build the file
b2.on('update', bundle2); // on any dep update, runs the bundler
b2.on('log', $.util.log); // output build logs to terminal

function bundle2() {
	return b2.bundle()
		// log errors if they happen
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('app.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
		.pipe($.uglify())
		.pipe(gulp.dest('app/js'));
}

gulp.task('watch', function() {
	return gulp.watch(paths.sass, ['sass']);
	//gulp.watch(paths.js, ['js']);
});


var nwOptions = {
	appDir: './app',
	files: './app/**/**', // use the glob format
	platforms: [ 'osx' ],
	buildDir: './dist',
	buildType: 'versioned',
	version: 'v0.12.2'
};

/**
 * Runs the app
 * Use the "--dev" option to enable toolbars and debug
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

gulp.task('default', ['sass', 'appjs', 'watch'], run);
