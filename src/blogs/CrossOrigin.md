# 关于跨域

## 什么叫跨域?
提到跨域首要要说的就是浏览器的同源策略（Same origin policy）  
在浏览器中无法通过 JavaScript 获取不同域下的 Cookie/LocalStorage/IndexDB  
无法操纵或读取不同域页面下的 DOM（例如无法获取通过 iframe 内嵌页面的 DOM）  
无法向不同域的服务器发起 AJAX 请求  
所谓的同域指的是域名/协议/端口号完全一致  
就算父域名相同子域名不同也算跨域  
例如从 `http://www.a.xx.com` 向 `http://www.b.xx.com` 发起请求也算跨域请求  
当我们通过 XHR 向不同域的地址发起请求时就会碰到跨域问题  
这时候如果接收请求的服务器未经过特殊配置，通常我们会在控制台中看到如下错误信息  
```
XMLHttpRequest cannot load xxx.
No 'Access-Control-Allow-Origin' header is present on the requested resource.
Origin 'xxx' is therefore not allowed access.
```

## 为什么浏览器会限制跨域请求?
浏览器对跨域请求进行限制主要是出于安全方面的考虑  
可以假想一下没有同源策略会引发什么样的问题  
假设我们正在访问一个正常网站 a.com 同时打开了另一个恶意站点 b.com  
如果没有同源限制，那么 b.com 页面上执行的恶意脚本文件即可获得我们所有的 Cookie/LocalStorage 中存放的数据  
通常我们会把登录相关的信息放在其中，还有可能存放一些用户的隐私数据  
这时 b.com 通过得到的登录相关信息又可以伪装成已登录的正常用户  
通过向 a.com 发起请求并携带上这些登录信息，攻击者甚至可以窃取更多存在服务器端的关键数据  
而 a.com 会认为这些请求是一个普通的已登录用户发出的  
更危险的是由于一切操作都由脚本执行，普通用户根本感知不到这个过程

## 怎样才能发起一个正确的跨域请求?
由于现今前后端分离的架构，在大多数情况下我们的前端工程不会和后端工程部署在同一域名下  
这个时候想前后端能进行正常交互就需要我们采取一些特殊的方法来绕过浏览器对跨域的限制  

### JSONP（JSON with Padding）
由于页面中静态资源的加载并不会受到同源策略的限制  
JSONP 正是利用 `<script>` 想页面中注入代码来实现跨域请求  
假设我们需要向 `http//www.a.com/api` 发起跨域请求  
客户端通过动态创建一个 `<script>` 标签并插入页面
```html
<script src="http//www.a.com/api?jsonp=cb"></script>
```
这样一个标签，浏览器就可以向该 URL 发起请求  
需要注意的是正是因为 JSONP 是通过这种方式向服务端请求的  
所以 JSONP 只能发起 GET 请求  
并且请求返回的类型（Content-Type）应该为 `text/javascript`  
请求中的参数 `?jsonp=cb` 是为了告诉服务端前端时使用哪个回调函数来处理请求返回的数据  
服务端需要将数据嵌套进这个函数中再返回  
例如返回的真实数据为 `{ a: 1 }`  
那么服务端在请求中需要返回的 Javascript 代码片段应该为 `cb({ a: 1 })`  
正因如此 JSONP 的命名是 JSON with Padding 因为需要服务端进行字符串 Padding 操作  
并且返回的数据恰好就是 JSON 格式，不需要经过 `JSON.parse()`  
这样当客户端收到这个代码片段并去执行时，我们便可以在先前定义好的 `cb()` 函数中接受到数据  
类似 Jquery 等库提供的 JSONP 功能其实就是对上述过程的一种封装

### CORS (Cross-Origin Resource Sharing)
W3C 在 2014 年正式推出了 CORS 协议来更好的解决跨域问题  
CORS 把请求分为简单请求和复杂请求  
复杂请求在发送正式请求之前会先发一个被称作 Preflight 的预校验 `OPTIONS` 请求  
只有当一个请求是
* GET
* HEAD
* POST

以上三种请求之一并且请求头只包含
* Accept
* Accept-Language
* Content-Type (Ps: 且值只能为 `application/x-www-form-urlencoded` 或 `multipart/form-data` 或 `text/plain`)
* Content-Language

如上几种时才会被认为是简单请求  
对于前端来说需要做的支持操作仅仅在于当需要 CORS 请求支持携带 Cookie 等认证信息时  
因为 CORS 请求默认不会携带这些信息  
将 `xhr` 的 `withCredentials` 设为 `true`  
```js
const xhr = new XMLHttpRequest()
xhr.withCredentials = true
```
以我目前的项目经历来看，碰到的跨域问题大都是后台配置有误，前端在这方面能做的有限  
下面介绍一下 CORS 用于验证跨域请求的一些相关 `HTTP Headers`  
请求头：
* Origin （请求来源域名也就是发起请求页面的域名）
* Access-Control-Request-Method （在预校验请求时预校验的 OPTIONS 请求中携带 告知服务端真实请求的类型）
* Access-Control-Request-Headers （同上 在预校验请求中携带 告知服务端真实请求会携带的自定义请求头）

响应头：
* Access-Control-Allow-Origin （必备 当前接口允许的请求来源域名 当设为 * 时 请求不能携带 Cookie 等鉴权信息）
* Access-Control-Allow-Headers （预校验请求返回 告知浏览器所有允许携带的自定义请求头）
* Access-Control-Allow-Methods （预校验请求返回 告知浏览器所有服务端支持的请求类型）
* Access-Control-Allow-Crendentials （可选 当需要传递 Cookie 时设为 true）
* Access-Control-Max-Age (预校验请求返回  告知浏览器在一段时间内缓存 不必再次发起预校验请求)
* Access-Control-Expose-Headers （前端能通过 `xhr.getResponseHeader()` 获取到哪些请求头的具体指）
