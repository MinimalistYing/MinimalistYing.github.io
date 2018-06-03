export default [{
	date: "2017/8/21",
	content: "Gulp确保任务按一定顺序执行 ```gulp.task('second', ['first'], () => {})``` Gulp在匹配的文件列表中剔除指定文件 ```gulp.src(['asset/*.js', '!asset/exclude.js'], () => {})``` 上述代码会匹配asset目录下除去exclude.js的所有以.js结尾的文件"
}, {
	date: "2017/8/21",
	content: "Gulp在文件变化时触发回调函数 ```gulp.watch('...', (event) => {})  //event.path 发生变化文件的路径  //event.type added|changed|deleted|renamed```"
}, {
	date: "2017/8/21",
	content: "在使用 ```gulp.src(...).pipe(...).pipe(...)``` 的过程中会发现当出错时控制台中报出的错误信息很难看懂,这是由于在Node.js中stream出错时会抛出error事件，而上述代码里没有写有关错误事件的处理函数，所以Node会默认的报出堆栈跟踪信息作为错误信息。如果采取如下捕获异常事件的方式来处理错误 ```gulp.src().pipe().on('err', () => {})``` 会使代码变得很复杂，推荐使用Pump的方式来进行处理 ```var pump = require('pump')  pump([gulp.src(), uglify(), concat()], cb)```"
}]