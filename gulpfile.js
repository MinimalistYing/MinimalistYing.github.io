const gulp= require('gulp')

gulp.task('default', () => {
	return gulp.src('dist/index.html')
		.pipe(gulp.dest('./'))
})
