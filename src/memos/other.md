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

关于HTML中的相对路径 `./` 是文档相对路径，也就是当前访问页面的路径 `/` 是基于站点根目录的相对路径，
举例说明访问网址http://0.0.0.0/1/2/son.html
* ./test.js => http://0.0.0.0/1/2/test.js
* /test.js => http://0.0.0.0/test.js

---

关于正则表达式量词(Regexp Quantifier)
* ?  => {0,1}
* \+ => {1,}
* \* => {0,}

如果只有一个量词则为贪婪匹配，会尽可能的匹配更多结果。如果量词后附加后缀?则进行非贪婪匹配。

---

页面上引用静态资源时的相对路径与绝对路径的区别，
* `src='xx.js'` 相对于当前页面的路径，
* `src='./xx.js'` 相对于当前页面的路径，
* `src='../xx.js'` 相对与当前页面的上级路径，
* `src='/xx.js'` 相对于根目录路径，
* `src='http//:xx.com/xx.js'` 绝对路径

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

全角空格占位符 `&emsp;` 可以完美的用作一个中文字符大小的空白  
不受字体大小变动影响

---

为什么移动端的点击事件会存在 300ms 左右的延时？
> 移动端的浏览器支持快速双击缩放页面，如果没有这个延时当用户点击时就无法判断用户是想要双击缩放还是仅仅单击。

> mobile browsers will wait approximately 300ms from the time that you tap the button to fire the click event. The reason for this is that the browser is waiting to see if you are actually performing a double tap.

解决方案：
* 禁用缩放: `<meta name="viewport" content="user-scalable=no">`
* 不禁用缩放，更改默认的视口宽度: `<meta name="viewport" content="width=device-width, initial-scale=1">`
* 直接使用 [FastClick](https://github.com/ftlabs/fastclick)

---

关于此图片来自微信公众平台未经允许不可引用的解决方法。  
搜了一下发现大多的方案都不正确，推测微信公众平台是依据浏览器请求图片资源时携带的 [Referer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) 来判断是否为盗链的。  
所以对于图片资源的最佳解决方案是利用 [Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) 例如：
```html
<img referrerPolicy="no-referrer" src="https://mmbiz.qpic.cn/mmbiz_png/9gYq0FHZpd3UzcibfXVwGSZVqUcaibCnJkFroYjTXSr8yKceicCPkm3iaXNNcseSaA7s79H1JZntXoIza7gMVJ1V4Q/640?wx_fmt=png&wxfrom=200" />
```