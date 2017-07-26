const gulp= require('gulp'),
	  less= require('gulp-less')

gulp.task('less', () => {
	return gulp.src('src/less/**/*.less')
		.pipe(less())
		.pipe(gulp.dest('assets/css'))
})

gulp.task('less:watch', () => {
	gulp.watch('src/less/**/*.less', ['less'])
})

gulp.task('default', ['less', 'less:watch'])