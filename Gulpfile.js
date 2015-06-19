var gulp = require('gulp'),
  react = require('gulp-react'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload;
  

gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: './'
    },
    startPath: '/lesson_1/lesson.html'
  });
});

gulp.task('default', ['server']);
