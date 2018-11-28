# Cookies 和 WebStorage

## 为什么需要浏览器存储
* 记录用户登录状态，当用户下次访问时不必重新登录
* 存储一些用户对应用的自定义偏好设置，例如主题色、表格每页默认显示条数等
* 一些广告商需要在浏览器端存储一些用户数据来做一些更个性化的推荐

恰当的利用浏览器存储可以很好的优化用户体验

## Cookies

### Cookies 是什么
Cookies 其实就是网站存储在客户端的一些小数据  
这些数据会自动的被加到网站发起的每个 HTTP 请求的 Request Header 中  
通常情况下服务端和客户端都可以对其进行 CRUD 操作

### 如何在前端新增 Cookie
```js
// 最简单的设置方式 属性全部采用默认值
document.cookie = 'name=value'
// 自定义 Cookie 属性
document.cookie = 'test=111; max-age=3600; domain=xx.com; path=/;'
```
一次只能同时新增一个 Cookie

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
这俩个 name 相同的 Cookie  
所以只有 `name` `domain` `path` 这三个值都相同时才能确定一个 Cookie

### 如何读取 Cookie
通过 `document.cookie` 获取到的是所有数据，类似 `name1=value1; name2=value2`  
要拿来使用的话还需通过一系列字符串操作将其转化为一般的对象

### 如何判断 Cookie 是否启用
```js
navigator.cookieEnabled
```
由于 Cookie 涉及到用户的隐私，用户可以手动禁止浏览器使用 Cookie  
绝大多数浏览器都可以通过上述代码来获得用户是否禁用　Cookie

### 关于 Cookies 的属性
* domain
* path
* max-age
* expires
* secure
* httponly

### Cookie 的优缺点
优点：
* 适合用于存放需要每个请求都必须携带的数据
* 服务端也可以直接操作 Cookie

缺点：
* 容量有限，规范只要求最低提供 4kb 的存储空间，嘴个域名最少
* 每次请求都会携带，如果存放了大量不必要的数据很显然会影响性能
* 不安全，永远不要在 Cookie 中存放用户的敏感数据
* 前端 API 不友好


## 其它注意事项
* 不管是 Cookies 还是 WebStorage 都是与浏览器相关的  
也就意味着在 Chrome 浏览器中存储的数据，当用户切换为 FireFox 浏览时就无法获取  
当然这应该是小概率事件，毕竟大多数人习惯于使用同一种浏览器

