在自测与后台有交互，会发送请求的地方时一定要注意在Chrome的Network中观察发送请求的URL、参数等是否符合预期，
同时也要注意考虑请求返回失败或返回空结果时页面UI的展示

---

关于采集站点的PV、UV数据，传统的做法是当页面load完成后像后台发送数据，
当作一次PV但在SPA(Single Page App)以及PWA(Progressive Web App)的情景下，这样的断定方式显得不那么合理，
用户有可能一天中只Load一次页面然后在一天的任意时间段在这个应用中活动
而不需要再一次Load页面考虑用更新的方式进行统计可能比较合理，
例如借助[Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
在用户初次打开应用浏览以及过去合理的一段时间后(可以用Session持续的最长时间来判断)后
从其它再次切换到这个Tab页都作为一次PV
详情可见这篇[Blog](https://philipwalton.com/articles/how-we-track-pageviews-is-all-wrong/)

---

HTML5新增了 `input` 事件来监听文本框的输入变化，但在IE9下存在用户删除输入或剪切文本时不会触发该事件的Bug,
并且IE8下没有该事件，需同时监听 `propertychange` 来实现兼容IE8

---

正则表达式中的 `.` 可以用于匹配除换行符外的所有字符,如果想匹配含换行符在内的所有字符可以使用 `[\s\S]`

---

在新的HTML5规范中，如果一个元素拥有ID属性，那么ID属性的属性值就会成为window对象的属性名，
属性值就是ID对应的元素。如果下列标签中的元素拥有name属性
* `<a>`
* `<applet>`
* `<area>`
* `<embed>`
* `<form>`
* `<frame>`
* `<frameset>`
* `<iframe>`
* `<img>`
* `<object>`

那么name属性的属性值就会成为window对象的属性名。
例如页面上有这么一个元素
```html
<div id='a'></div>
`
在script中
```js
console.info(a)  //结果为<div id='a'></div>
```

---

阅读垠神博客有感
* 会写程序不是一件很了不起的事情，不要自负
* 语言、框架都只是工具，会用即可，不必过于推崇，重要的是我们脑海里的思想
* 开发软件也是一种工程，一定要极力避免Bug，这才是一个工程师该做的
* 面对同事、新人的提问请耐心解答，不要动不动就让提问者自行Google
* 不要觉得向他人提问是什么难为情的事，世界上总有东西是你不清楚的，哪怕是你日常工作所用的东西
* 复杂的代码不是显示能力的途径，简单易懂的才是

---

在HTML中属性可以用双引号、单引号、甚至不用引号包围，浏览器都是支持的。
所以Google为了节省字节会采用不用引号的风格，大概对访问量极大的网站这也是一种省钱的方式吧

---

```html
<meta http-equiv="Content-Type"
	content="text/html; charset=utf-8">
<meta charset="utf-8">
```
在HTML中俩者都可用来表明页面所采用的字符集，各浏览器的兼容性良好，但后者更短建议采用后者

---

当页面的UI需要在后台数据返回后进行刷新时，一定要考虑到网络极差的情况下，请求会延迟很久后返回。
这期间UI要怎样展示，或者用户能否进行操作，会不会有遗留的表单数据等等。

---

关于HTML中的相对路径 `./` 是文档相对路径，也就是当前访问页面的路径 `/` 是基于站点根目录的相对路径，
举例说明访问网址http://0.0.0.0/1/2/son.html
* ./test.js => http://0.0.0.0/1/2/test.js
* /test.js => http://0.0.0.0/test.js

---

关于正则表达式量词(Regexp Quantifier)
* ?  => {0,1}
* \\+ => {1,}
* \\*  => {0,}

如果只有一个量词则为贪婪匹配，会尽可能的匹配更多结果。如果量词后附加后缀?则进行非贪婪匹配。

---

匹配中文字符（简繁体都包含）的正则 `/^[\u4e00-\u9fa5]+$/` 暂时无法确认其是否完全正确

---

npm安装node-sass报错 `%1 is not a valid Win32 application` 看了看报错信息大概是说什么东西下载失败导致的，
切换成淘宝镜像用cnmp安装就好了 `npm install -g cnpm --registry=https://registry.npm.taobao.org`

---

由于node有许多底层依赖包需要依靠c++,所以需要额外安装 `node-gyp` 提供跨平台的编译支持，
安装之前需要先装好相应的python/c++等环境，
根据官方文档 `npm install --global --production windows-build-tools` 即可
（很多情况下的npm安装失败可能都是因为这个没装好）

---

页面上引用静态资源时的相对路径与绝对路径的区别，
* `src='xx.js'` 相对于当前页面的路径，
* `src='./xx.js'` 相对于当前页面的路径，
* `src='../xx.js'` 相对与当前页面的上级路径，
* `src='/xx.js'` 相对于根目录路径，
* `src='http//:xx.com/xx.js'` 绝对路径

---

避免浏览器缓存HTML页面可以在head中加上标签
```html
<meta http-equiv='Cache-Control' content='no-store'>
```
通常会采用 `no-cache` 的策略，只有在服务器的资源发生变化时才去再重新拉取，否则返回304采用缓存的资源
Ps: 这种方式好像不可靠，不能保证浏览器一定会按照这个规则来执行，最好还是去配置提供静态资源的服务端容器

---

Gulp确保任务按一定顺序执行
```js
gulp.task('second', ['first'], () => {})
``` 
Gulp在匹配的文件列表中剔除指定文件
```js
gulp.src(['asset/*.js', '!asset/exclude.js'], () => {})
```
上述代码会匹配asset目录下除去exclude.js的所有以.js结尾的文件

---

Gulp在文件变化时触发回调函数
```js
gulp.watch('...', (event) => {})
// event.path 发生变化文件的路径
// event.type added|changed|deleted|renamed
```

---

在使用
```js
gulp.src(...).pipe(...).pipe(...)
```
的过程中会发现当出错时控制台中报出的错误信息很难看懂,这是由于在Node.js中stream出错时会抛出error事件，
而上述代码里没有写有关错误事件的处理函数，所以Node会默认的报出堆栈跟踪信息作为错误信息。
如果采取如下捕获异常事件的方式来处理错误
```js
gulp.src().pipe().on('err', () => {})
```
会使代码变得很复杂，推荐使用Pump的方式来进行处理
```js
var pump = require('pump')
pump([gulp.src(), uglify(), concat()], cb)
```

---

当页面有大量图片需要展示时可以考虑采用Google提出的[webp](https://developers.google.com/speed/webp/)来进行优化  
由于兼容性还欠佳所以仍需要做一些降级工作，在浏览器不支持时降级为其它图片格式
相关细节可以看[这篇Blog](https://aotu.io/notes/2016/06/23/explore-something-of-webp/index.html)

---

算法题中经常出现要求输出modulo 10^9+7后的结果  
是因为当数字过大时，程序需要特定的算法才能精确的计算  
而通过模计算，可以使得不需要实现大数计算的算法便可比较结果的正确性
[Stackoverflow](https://stackoverflow.com/questions/25689186/what-is-the-significance-of-modulo-1097-used-in-codechef-and-spoj-problems)

---

众所周知，页面的加载顺序是从上至下的，并且浏览器中的 JavaScript 为单线程执行    
所以当碰到 `<script src="xxx"></script>` 时，浏览器会等待脚本下载并执行完才继续渲染页面  
如果脚本文件很大或者网络较慢就会导致浏览器长时间处于白屏状态，不那么耐心的用户可能会选择直接关闭网页  
起初开发者想到的优化办法是尽可能的把 `<script>` 放到页面底部（也就是 `</body>` 前）  
这样脚本加载便不会影响到页面最初的渲染效率了  
HTML5 新引入了 `defer` 以及 `async` 来优化这个过程  
* `<script defer src="xxx"></script>`  会使脚本的下载与页面渲染并行进行  
当页面渲染完毕后才去依次执行下载完的脚本文件
* `<script async src="xxx"></script>`  也会使脚本的下载与页面渲染并行进行  
与 `defer` 的区别在于一等到脚本下载完成浏览器便会暂停渲染并执行相应的脚本  

[点击看图](https://segmentfault.com/q/1010000000640869)

---

读完 [Dan Abramov 的 Blog](https://overreacted.io/things-i-dont-know-as-of-2018/) 的感想
* 即使是一名经验再丰厚的开发者也不是什么都会  
不应该期望一个开发者能熟练的掌握所有技能
* 但是开发者应该有着各自擅长的专业方向  
并且具备快速学习新技术的能力
* 开发者需要更深入的去学习理解自己的专精技能  
并且对其充满自信，总有一些方面那些更有经验的开发者也没有你理解的透彻

---

Sublime 安装问题以及解决
### There are no packages available for install  
修改 Package Control 设置，增加
```
"channels":
    [
        "http://cst.stu.126.net/u/json/cms/channel_v3.json"
    ]
```

### 无法安装 Package Control 
下载 Package Control.sublime-package 放入 Sublime Installed Package 目录下

---

可以通过
```html
<noscript>
	<p>抱歉 禁用 Javascript 会导致应用不能正常工作</p>
</noscript>
```
在用户浏览器不支持 Javascript 或者用户手动禁用 Javascript 时展示相关提示信息

---

可以使用 `<pre>` 来展示代码 / JSON 等内容  
因为该标签内等空格换行会被完整保留

---

全角空格占位符 `&emsp;` 可以完美的用作一个中文字符大小的空白  
不受字体大小变动影响

---

关于 NPM 的 `dependencies` `devDependencies` `peerDependencies`  
项目实际依赖的包通常是 `dependencies` 通过 `npm i package --save-prod` 或者默认的 `npm i package` 安装的包会被列在该目录下  
仅在开发过程中被使用的依赖是 `devDependencies` 通过 `npm i package --save-dev` 会被列在该目录下，类似 `babel` `sass` `webpack` 等通常属于这一类  
最后 `peerDependencies` 通常会在开发一些插件包的时候被使用。例如开发一个 React 的 UI 组件，如果其他开发者想要使用的话必须确保在他的本地环境中已经安装好了使用该 UI 组件的 `peerDependencies` 例如特定版本的 `react` 。这样做的好处是可以尽可能的减少不必要的依赖被安装。

---

关于 NPM 中常见的 Sematic Version Operator  
`~1.0.1` 意味着可以接受大于或等于 `1.0.1` 但是小于 `1.1.0` 之间的所有版本  
`^1.0.1` 意味着可以接受大于或等于 `1.0.1` 但是小于 `2.0.0` 之间的所有版本