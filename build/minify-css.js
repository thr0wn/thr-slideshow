var path = require('path');
var rootDir = path.join(__dirname, '../..');

module.exports = function (gulp, $, resources) {
    gulp.task('minify-css', function () {
        return gulp.src(resources.css)
            .pipe($.autoprefixer({
                browsers: ['> 1%'],
                cascade: false
            }))
            .pipe(gulp.dest(resources.out))
            .pipe(gulp.dest(resources.docs))
            .pipe($.cleanCss())
            .pipe($.rename(function(path) {
                path.extname = ".min.css"
            }))
            .pipe(gulp.dest(resources.out));
    });
};