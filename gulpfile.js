var $ = require('gulp-load-plugins')();
var gulp = require('gulp');

var resources = {
	out: 'dist',
	docs: 'docs',
	js: 'src/**/*.js',
	partials: 'src/**/*.html',
	css: 'src/**/*.css'
};

requireTask('clean');
requireTask('babel');
requireTask('minify-css');

gulp.task('build', '', function (cb) {
	$.sequence('clean', ['minify-css', 'babel'], cb);
});

gulp.task('default', ['build']);

function requireTask(task) {
	require('./build/' + task + '.js')(gulp, $, resources);
}
