var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var minify = require('gulp-minify');
var bufferize = require('vinyl-buffer');
var concatCss = require('gulp-concat-css'); 
var cleanCSS = require('gulp-clean-css');

var browserSync = require('browser-sync');

var bs = browserSync.create(),
	bs_reload = bs.reload;

gulp.task('copy:assets:js', function() {
	return gulp.src('./js/jquery.min.js')
		.pipe(gulp.dest('dist/js'));
});
gulp.task('copy:assets:bootstrap', function() {
	return gulp.src('./css/bootstrap/dist/**/**')
		.pipe(gulp.dest('dist/bootstrap'));
});
gulp.task('copy:assets:font-awesome:css', function() {
	return gulp.src('./css/font-awesome/css/font-awesome.min.css')
		.pipe(gulp.dest('dist/font-awesome/css'));
});
gulp.task('copy:assets:font-awesome:fonts', function() {
	return gulp.src('./css/font-awesome/fonts/**/**')
		.pipe(gulp.dest('dist/font-awesome/fonts'));
});

gulp.task('copy:assets:font-awesome', ['copy:assets:font-awesome:fonts', 'copy:assets:font-awesome:css']);

gulp.task('copy:assets',['copy:assets:font-awesome','copy:assets:bootstrap','copy:assets:js']);

gulp.task('build:js', ['copy:assets:js'], function () {
    return browserify({entries: './js/source/app.js', extensions: ['.js']})
        .transform('babelify', {presets: ['es2015', 'react']})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(bufferize())
        .pipe(minify())
        .pipe(gulp.dest('dist/js'))
        .pipe(bs_reload({stream : true}))
});
gulp.task('build:css', function () {
    return gulp.src(['./css/app.css','./css/components/**/*.css'])
    	.pipe(concatCss('bundle.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'))
        .pipe(bs_reload({stream : true}));
});

gulp.task('build:html', function() {
	return gulp.src('./index.html')
		.pipe(gulp.dest('dist'))
		.pipe(bs_reload({stream : true}));
});

gulp.task('build',['build:html', 'build:js','build:css','copy:assets']);

gulp.task('watch', ['build'], function () {
    gulp.watch('./js/source/**/*.js', ['build:js']);
    gulp.watch('./css/**/*.css', ['build:css']);
    gulp.watch('./index.html', ['build:html']);
});

gulp.task('default', ['watch'], function() {
	browserSync.init({
		server: {
			baseDir : './dist/'
		}
	});
});