# Cookies 和 WebStorage

## 为什么需要浏览器存储
* 记录用户登录状态，当用户下次访问时不必重新登录
* 存储一些用户对应用的自定义偏好设置，例如主题色、表格每页默认显示条数等
* 一些广告商需要通过浏览器端存储的一些用户行为数据来做一些更个性化的推荐

恰当的利用浏览器存储可以很好的优化用户体验

## Cookies

### Cookies 是什么
Cookies 其实就是网站存储在客户端的一些数据  
这些数据会自动的被加到网站发起的每个 HTTP 请求的 Request Header 中  
通常情况下服务端和客户端都可以对 Cookies 进行 CRUD 操作  

### 如何在前端新增 Cookie
```js
// 最简单的设置方式 属性全部采用默认值
document.cookie = 'name=value'
// 自定义 Cookie 属性
document.cookie = 'test=111; max-age=3600; domain=xx.com; path=/;'
```
注意一次只能同时新增一个 Cookie

### 如何在前端修改或删除 Cookie
```js
// 修改
document.cookie = 'test=222; max-age=7200; domain=xx.com; path=/'
// 删除
document.cookie = 'test=; max-age=0; domain=xx.com; path=/'
```
这里要注意的是要确保 `domain` 以及 `path` 与待修改 Cookie 设置的一致  
因为 Cookie 其实是在同一个域名和路径下唯一  
例如我们访问 `www.a.com/test/xx.html`  
可以同时存在 `test=1; domain=a.com; path=/test` 以及 `test=1; domain=a.com; path=/`  
这俩个 name 相同但是 path 不同的同名 Cookie  
所以只有 `name` `domain` `path` 这三个值都相同时才能确定一个 Cookie

### 如何读取 Cookie
通过 `document.cookie` 获取到的是所有数据，类似 `name1=value1; name2=value2`  
要拿来使用的话还需通过一系列字符串操作将其转化为一般的对象

### 如何判断 Cookie 是否启用
```js
navigator.cookieEnabled
```
由于 Cookie 涉及到用户的隐私，用户可以手动禁止浏览器使用 Cookie  
绝大多数浏览器都可以通过上述代码来判断用户是否禁用 Cookie  
Ps: 经本人测试 禁用 Cookie 后 Github 淘宝 等都无法正常访问  
应该现在大多数用户都不会去禁用 Cookie

### 关于 Cookies 的属性
* domain  
指定 Cookie 存储在哪个域名下 默认为当前服务器的域名  
当然也遵循同源策略 例如在 `www.son.a.com` 页面下    
我们可以设置 Cookie 的 domain 为 `a.com`  
这样在 `www.another.a.com` 页面也可以获取到该 Cookie  
但是不能在该页面设置 domain 为 `b.com` 的 Cookie
* path  
指定 Cookie 存储在哪个路径下 默认为当前 URI 中的路径  
例如在 `www.a.com/page/one.html` 我们按默认属性设置了一个Cookie  
那么在 `www.a.com/page/two.html` `www.a.com/page/son/three.html`  
这些页面下都可以获取这个 Cookie  
但是在 `www.a.com/another/four.html` 页面上便无法得到这个 Cookie  
可以将 path 设为 `/` 使得访问当前域名下所有路径的网页都能拿到设置的 Cookie
* max-age 最大存储时间 以秒为单位 默认当浏览器 Session 结束时清除
* expires 存储失效的 GMT 时间 默认当浏览器 Session 结束时便清除
* secure 包含该属性的 Cookie 只能通过 HTTPS 传输
* httponly  
只能在服务端进行设置  
包含该属性的 Cookie 只会在 Request Headers 中出现  
并且前端无法通过 `document.cookie` 查看修改

### 关于 Cookies 中的保留字符
由于 `;` `,` 在 Cookie 中有特殊含义  
所以当存储的数据中包含这些特殊字符时  
需要在存储前通过 `encodeURIComponent` 进行编码  
读取前通过 `decodeURIComponent` 进行解码

### Cookies 的优缺点
优点：
* 适合用于存放需要每个请求都必须携带的数据
* 服务端也可以直接操作 Cookie

缺点：
* 容量有限，规范只要求每个域名下最低提供 4kb 的存储空间
* 每次请求都会携带，如果存放了大量不必要的数据很显然会影响页面性能
* 不安全，永远不要在 Cookie 中存放用户的敏感数据
* 前端 API 不友好，CRUD 都是通过 `document.cookie` 进行，没有提供相关操作的方法

### 最新协议
[Cookies 协议](https://tools.ietf.org/html/rfc6265#section-5.2.1)

## 其它注意事项
* 不管是 Cookies 还是 WebStorage 都是与浏览器相关的  
也就意味着在 Chrome 浏览器中存储的数据，当用户切换为 FireFox 浏览时就无法获取  
当然这应该是小概率事件，毕竟大多数人习惯于使用同一种浏览器
* 在浏览器设置 Cookie 失败时并不会报错，这个过程是静默的  
例如当你试图跨域的去设置 Cookie 时只会发现不生效，但不会在控制台中看到相应错误信息

