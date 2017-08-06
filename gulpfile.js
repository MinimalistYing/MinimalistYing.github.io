const gulp= require('gulp'),
	  less= require('gulp-less')
	  plumber = require('gulp-plumber')
	  autoprefixer = require('gulp-autoprefixer')

gulp.task('less', () => {
	return gulp.src('src/less/**/*.less')
		.pipe(plumber())
		.pipe(less())
		.pipe(autoprefixer({browsers: ['last 4 versions']}))
		.pipe(gulp.dest('assets/css'))
})

gulp.task('less:watch', () => {
	gulp.watch('src/less/**/*.less', ['less'])
})

gulp.task('default', ['less', 'less:watch'])