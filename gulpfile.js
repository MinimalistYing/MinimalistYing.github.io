const gulp= require('gulp')

gulp.task('default', () => {
	return gulp.src('dist/**/*')
		.pipe(gulp.dest('./'))
})
