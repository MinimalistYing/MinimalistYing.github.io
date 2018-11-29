# Cookies 和 WebStorage

## 为什么需要客户端存储
* 记录用户登录状态，当用户下次访问时不必重新登录
* 存储一些用户对应用的自定义偏好设置，例如主题色、表格每页默认显示条数等
* 一些广告商需要通过客户端端存储的一些用户行为数据来做一些更个性化的推荐

恰当的利用客户端存储可以很好的优化用户体验

## Cookies

### Cookies 是什么
Cookies 其实就是网站存储在客户端的一些数据  
这些数据会自动的被加到网站发起的每个 HTTP 请求的 Request Header 中  
通常情况下服务端和客户端都可以对 Cookies 进行 CRUD 操作  
[Cookies 协议](https://tools.ietf.org/html/rfc6265#section-5.2.1)

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
* 可以控制数据存储的 domain 以及 path 范围

缺点：
* 容量有限，规范只要求每个域名下最低提供 4kb 的存储空间
* 每次请求都会携带，如果存放了大量不必要的数据很显然会影响页面性能
* 不安全，永远不要在 Cookie 中存放用户的敏感数据
* 前端 API 不友好，CRUD 都是通过 `document.cookie` 进行，没有提供相关操作的方法

### WebStorage

## WebStorage 是什么
WebStorage 是 HTML5 新增的客户端存储机制  
分为 `LocalStorage` 以及 `SessionStorage`  
IE8+ 以及各现代浏览器对其都有良好的支持  
[WebStorage 规范](https://html.spec.whatwg.org/multipage/webstorage.html#storage)

## LocalStorage
永久存储（除非浏览器缓存被清除）在当前域下，遵循同源策略  
如果在一个浏览器打开多开 Tab 访问同一域名的网站其 LocalStorage 也是共享的

## SessionStorage
存储周期为当前 Session ，同样遵循同源策略  
要注意这里的 Session 和 Cookie 的默认存储 Session 不同  
SessionStorage 针对的是每一个 Tab 页，而不是整个浏览器的进程

## API
```
// sessionStorage 与 localStorage 一致
localStorage.a = 'test1' // 新增或修改
localStorage.a // 读取

localStorage.setItem(a, 'test3') // 新增
localStorage.getItem(a) // 读取
localStorage.removeItem(a) // 删除
localStorage.clear() // 清空所有
localStorage.key(index) // 获取指定 index 存储键值对的 key
localStorage.length // 总共存储的键值对数量
```
可以看到通过类似操作普通对象属性一样来操作 WebStorage 更加简洁  
但是也有类似 `clear()` `removeItem()` 等操作只能通过 API 进行

## Storage Event



## WebStorage 的优势
* 每个域下允许存储超过 5MB 的数据（各个浏览器有所不同）
* 更友好的 API


## 其它注意事项
* 不管是 Cookies 还是 WebStorage 都是与浏览器相关的  
也就意味着在 Chrome 浏览器中存储的数据，当用户切换为 FireFox 浏览时就无法获取  
当然这应该是小概率事件，毕竟大多数人习惯于使用同一种浏览器
* 在浏览器设置 Cookie 失败时并不会报错，这个过程是静默的  
例如当你试图跨域的去设置 Cookie 时只会发现不生效，但不会在控制台中看到相应错误信息
* 虽然 WebStorage 的规范希望能支持对类似数组对象等结构化数据进行存储  
但目前为止大多数浏览器仅支持字符串作为 Value  
传入非字符串的值会被强制转化为字符串  
例如试图通过 `localStorage.o = {a: 1}` 存储一个对象  
会发现实际存储的是 `o: "[object Object]"`

