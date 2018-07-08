export default [{
	date: `2017/8/6`,
	content: `
在自测与后台有交互，会发送请求的地方时一定要注意在Chrome的Network中观察发送请求的URL、参数等是否符合预期，
同时也要注意考虑请求返回失败或返回空结果时页面UI的展示
`
}, {
	date: `2017/8/14`,
	content: `
关于采集站点的PV、UV数据，传统的做法是当页面load完成后像后台发送数据，
当作一次PV但在SPA(Single Page App)以及PWA(Progressive Web App)的情景下，这样的断定方式显得不那么合理，
用户有可能一天中只Load一次页面然后在一天的任意时间段在这个应用中活动
而不需要再一次Load页面考虑用更新的方式进行统计可能比较合理，
例如借助[Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
在用户初次打开应用浏览以及过去合理的一段时间后(可以用Session持续的最长时间来判断)后
从其它再次切换到这个Tab页都作为一次PV
详情可见这篇[Blog](https://philipwalton.com/articles/how-we-track-pageviews-is-all-wrong/)
`
}, {
	date: `2017/8/17`,
	content: `
HTML5新增了 \`input\` 事件来监听文本框的输入变化，但在IE9下存在用户删除输入或剪切文本时不会触发该事件的Bug,
并且IE8下没有该事件，需同时监听 \`propertychange\` 来实现兼容IE8
`
}, {
	date: `2017/8/20`,
	content: `
正则表达式中的 \`.\` 可以用于匹配除换行符外的所有字符,如果想匹配含换行符在内的所有字符可以使用 \`[\s\S]\`
`
}, {
	date: `2017/8/23`,
	content: `
在新的HTML5规范中，如果一个元素拥有ID属性，那么ID属性的属性值就会成为window对象的属性名，
属性值就是ID对应的元素。如果下列标签中的元素拥有name属性
* \`<a>\`
* \`<applet>\`
* \`<area>\`
* \`<embed>\`
* \`<form>\`
* \`<frame>\`
* \`<frameset>\`
* \`<iframe>\`
* \`<img>\`
* \`<object>\`

那么name属性的属性值就会成为window对象的属性名。
例如页面上有这么一个元素
\`\`\`html
<div id='a'></div>
\`
在script中
\`\`\`js
console.info(a)  //结果为<div id='a'></div>
\`\`\`
`
}, {
	date: `2017/8/30`,
	content: `
阅读垠神博客有感
* 会写程序不是一件很了不起的事情，不要自负
* 语言、框架都只是工具，会用即可，不必过于推崇，重要的是我们脑海里的思想
* 开发软件也是一种工程，一定要极力避免Bug，这才是一个工程师该做的
* 面对同事、新人的提问请耐心解答，不要动不动就让提问者自行Google
* 不要觉得向他人提问是什么难为情的事，世界上总有东西是你不清楚的，哪怕是你日常工作所用的东西
* 复杂的代码不是显示能力的途径，简单易懂的才是
`
}, {
	date: `2017/9/4`,
	content: `
在HTML中属性可以用双引号、单引号、甚至不用引号包围，浏览器都是支持的。
所以Google为了节省字节会采用不用引号的风格，大概对访问量极大的网站这也是一种省钱的方式吧
`
}, {
	date: `2017/9/5`,
	content: `
\`\`\`html
<meta http-equiv="Content-Type"
	content="text/html; charset=utf-8">
<meta charset="utf-8">
\`\`\`
在HTML中俩者都可用来表明页面所采用的字符集，各浏览器的兼容性良好，但后者更短建议采用后者
`
}, {
	date: `2017/9/13`,
	content: `
当页面的UI需要在后台数据返回后进行刷新时，一定要考虑到网络极差的情况下，请求会延迟很久后返回。
这期间UI要怎样展示，或者用户能否进行操作，会不会有遗留的表单数据等等。
`
}, {
	date: `2017/9/13`,
	content: `
关于HTML中的相对路径 \`./\` 是文档相对路径，也就是当前访问页面的路径 \`/\` 是基于站点根目录的相对路径，
举例说明访问网址http://0.0.0.0/1/2/son.html
* ./test.js => http://0.0.0.0/1/2/test.js
* /test.js => http://0.0.0.0/test.js
`
}, {
	date: `2017/9/28`,
	content: `
关于正则表达式量词(Regexp Quantifier)
* ?  => {0,1}
* \\+ => {1,}
* \\*  => {0,}

如果只有一个量词则为贪婪匹配，会尽可能的匹配更多结果。如果量词后附加后缀?则进行非贪婪匹配。
`
}, {
	date: `2017/11/9`,
	content: `
匹配中文字符（简繁体都包含）的正则 \`/^[\u4e00-\u9fa5]+$/\` 暂时无法确认其是否完全正确
`
}, {
	date: `2017/11/14`,
	content: `
npm安装node-sass报错 \`%1 is not a valid Win32 application\` 看了看报错信息大概是说什么东西下载失败导致的，
切换成淘宝镜像用cnmp安装就好了 \`npm install -g cnpm --registry=https://registry.npm.taobao.org\`
`
}, {
	date: `2017/11/17`,
	content: `
由于node有许多底层依赖包需要依靠c++,所以需要额外安装 \`node-gyp\` 提供跨平台的编译支持，
安装之前需要先装好相应的python/c++等环境，
根据官方文档 \`npm install --global --production windows-build-tools\` 即可
（很多情况下的npm安装失败可能都是因为这个没装好）
`
}, {
	date: `2018/3/26`,
	content: `
页面上引用静态资源时的相对路径与绝对路径的区别，
* \`src='xx.js'\` 相对于当前页面的路径，
* \`src='./xx.js'\` 相对于当前页面的路径，
* \`src='../xx.js'\` 相对与当前页面的上级路径，
* \`src='/xx.js'\` 相对于根目录路径，
* \`src='http//:xx.com/xx.js'\` 绝对路径
`
}, {
	date: `2018/4/20`,
	content: `
避免浏览器缓存HTML页面可以在head中加上标签
\`\`\`html
<meta http-equiv='Cache-Control' content='no-store'>
\`\`\`
通常会采用 \`no-cache\` 的策略，只有在服务器的资源发生变化时才去再重新拉取，否则返回304采用缓存的资源
`
}, {
	date: `2017/8/21`,
	content: `
Gulp确保任务按一定顺序执行
\`\`\`js
gulp.task('second', ['first'], () => {})
\`\`\` 
Gulp在匹配的文件列表中剔除指定文件
\`\`\`js
gulp.src(['asset/*.js', '!asset/exclude.js'], () => {})
\`\`\`
上述代码会匹配asset目录下除去exclude.js的所有以.js结尾的文件
`
}, {
	date: `2017/8/21`,
	content: `
Gulp在文件变化时触发回调函数
\`\`\`js
gulp.watch('...', (event) => {})
// event.path 发生变化文件的路径
// event.type added|changed|deleted|renamed
\`\`\`
`
}, {
	date: `2017/8/21`,
	content: `
在使用
\`\`\`js
gulp.src(...).pipe(...).pipe(...)
\`\`\`
的过程中会发现当出错时控制台中报出的错误信息很难看懂,这是由于在Node.js中stream出错时会抛出error事件，
而上述代码里没有写有关错误事件的处理函数，所以Node会默认的报出堆栈跟踪信息作为错误信息。
如果采取如下捕获异常事件的方式来处理错误
\`\`\`js
gulp.src().pipe().on('err', () => {})
\`\`\`
会使代码变得很复杂，推荐使用Pump的方式来进行处理
\`\`\`js
var pump = require('pump')
pump([gulp.src(), uglify(), concat()], cb)
\`\`\`
`
}]