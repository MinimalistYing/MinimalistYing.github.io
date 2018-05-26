const gulp= require('gulp')
// 	  less= require('gulp-less'),
// 	  plumber = require('gulp-plumber'),
// 	  autoprefixer = require('gulp-autoprefixer'),
// 	  cleanCSS = require('gulp-clean-css'),
// 	  markdown = require('gulp-markdown')
// 	  simpleMarkDown = require('./gulp-simple-markdown')

// // 预处理less
// gulp.task('less', () => {
// 	return gulp.src('src/less/**/*.less')
// 		.pipe(plumber())
// 		.pipe(less())
// 		.pipe(autoprefixer({browsers: ['last 4 versions']}))
// 		.pipe(cleanCSS({compatibility: 'ie8'}))
// 		.pipe(gulp.dest('dist/assets/css'))
// })

// // 预处理自己用部分MarkDown语法写的HTML
// gulp.task('simplemarkdown', () => {
// 	return gulp.src('src/view/memo.html')
// 		.pipe(simpleMarkDown())
// 		.pipe(gulp.dest('dist/'))
// })

// // 将博客的markdown转化为html
// gulp.task('markdown', () => {
// 	return gulp.src('src/blog/**/*.md')
// 		.pipe(markdown())
// 		.pipe(gulp.dest('dist/blog/'))
// })

// // 监听文件改变 对改变的文件进行预处理
// gulp.task('watch', () => {
// 	gulp.watch('src/less/**/*.less', ['less'])
// 	gulp.watch('src/view/memo.html', ['simplemarkdown'])
// 	gulp.watch('src/blog/**/*.md', ['markdown'])
// })

// gulp.task('default', ['less', 'simplemarkdown', 'watch', 'markdown'])

gulp.task('default', () => {
	return gulp.src('dist/index.html')
		.pipe(gulp.dest('./'))
})
