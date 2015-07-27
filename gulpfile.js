var gulp = require('gulp'),
    path = require('path'),
    $ = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;
  
var paths = {
    startUrl: '/lesson_1/lesson.html',
    scripts: ['lesson_*/src/*.js']
};

var handleError = function(title, message) {
    return function() {
        var args = Array.prototype.slice.call(arguments);

        // Show notification
        $.notify.onError({
            title: title,
            message: message || '<%= options.stripColor(error.message) %>',
            templateOptions: {
                stripColor: $.util.colors.stripColor
            }
        }).apply(this, args);

        // Keep gulp from hanging on this task
        this.emit('end');
    };
};
 
gulp.task('server', function() {
    browserSync({
        server: {
            baseDir: './'
        },
        startPath: paths.startUrl
    });
});

gulp.task('transform', function(){
    return gulp.src(paths.scripts)
        .pipe($.plumber(handleError('Script Compile Error')))
        .pipe($.react())
        .pipe($.rename(function(file) {
            file.dirname = file.dirname.replace('/src', '/build');
        }))
        .pipe(gulp.dest('./'))
});

gulp.task('watch', ['transform'], function () {
    gulp.watch(paths.scripts, ['transform', reload]);
});

gulp.task('default', ['server', 'watch']);
