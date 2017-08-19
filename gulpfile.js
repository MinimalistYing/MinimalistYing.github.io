const gulp= require('gulp'),
	  less= require('gulp-less')
	  plumber = require('gulp-plumber')
	  autoprefixer = require('gulp-autoprefixer')
	  cleanCSS = require('gulp-clean-css')
	  simpleMarkDown = require('./gulp-simple-markdown')

// 预处理less
gulp.task('less', () => {
	return gulp.src('src/less/**/*.less')
		.pipe(plumber())
		.pipe(less())
		.pipe(autoprefixer({browsers: ['last 4 versions']}))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('assets/css'))
})

// 预处理自己用部分MarkDown语法写的HTML
gulp.task('markdown', () => {
	return gulp.src('src/view/memo.html')
		.pipe(simpleMarkDown())
		.pipe(gulp.dest('./'))
})

gulp.task('less:watch', () => {
	gulp.watch('src/less/**/*.less', ['less'])
})

gulp.task('markdown:watch', () => {
	gulp.watch('src/view/memo.html', ['markdown'])
})

gulp.task('default', ['less', 'markdown', 'less:watch', 'markdown:watch'])