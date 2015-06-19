var gulp = require('gulp'),
  rename = require('gulp-rename'),
  react = require('gulp-react'),
  path = require('path'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload;
  
var paths = {
  scripts: ['lesson_*/src/*.js']
};
 
gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: './'
    },
    startPath: '/lesson_1/lesson.html'
  });
});

gulp.task('transform', function(){
  return gulp.src(paths.scripts)
    .pipe(react())
    .pipe(rename(function(file) {
        file.dirname = file.dirname.replace('/src', '/build');
    }))
    .pipe(gulp.dest('./'))
});

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['transform', reload]);
});

gulp.task('default', ['server', 'watch']);
