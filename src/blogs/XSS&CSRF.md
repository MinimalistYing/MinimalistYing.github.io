# 关于 XSS 以及 CSRF

## XSS (Cross-Site Scripting)

### 攻击原理
利用网站对用户输入的信任进行攻击  
假设一个博客网站将用户的输入不经转义直接存入数据库，又原封不动的将数据库的内容插入页面中展示  
这时候如果恶意用户在发布的一篇博文中加入了的一串脚本代码
```html
博客正文内容...
<script>
// 恶意脚本 窃取用户信息 跳转恶意网站 修改页面显示内容
</script>
```
当其余用户浏览该篇博文时，由于未经过任何转义，恶意脚本和正文一起被插入页面的 DOM 节点中  
脚本中的代码随即被浏览器加载执行，也就形成了一次 XSS 攻击

### 防范方法
不信任任何用户的输入，对所有用户输入进行转义后才存入数据库  
所有用户输入的内容先进行转义再插入相应 DOM 节点  
React/Vue/Angular 等前端框架大多都默认进行了转义处理  
例如在 React 中需要使用 `dangerouslySetInnerHTML={}` Vue 中需要使用 `v-html` 来插入未转义的内容  
这些默认行为有时会使得开发者忽视掉防范 XSS 攻击，只要足够小心这类攻击其实可以被完全杜绝  
此外，将 Cookie 设为 `HttpOnly` 可以阻止当进行 XSS 攻击的恶意脚本获取存储在 Cookie 中的敏感信息

## CSRF (Cross-Site Request Forgery)

### 攻击原理
假设用户在登录了 `www.bank.com` 的同时打开了 `www.evil.com`  
而攻击者恰好知道转账的接口为 `www.bank.com/transfer?to=AcountId&amount=99999`  
这时候攻击者在 `www.evil.com` 的页面上隐藏了一个 `<img src="www.bank.com/transfer?to=AcountId&amount=99999">`  
如果银行网站恰好仅仅简单的利用 Cookie 进行用户校验（当然大部分情况下银行网站不会这么傻）  
由于 `<img>` 可以绕开 Same-Origin Policy 的限制  
所以这个 GET 请求会正确发送并且携带上用户登录信息的相关 Cookie ，成功将钱转到了攻击者的账号  

### 防范方法
* 合理的设计 API ，GET 请求不应该进行带有 Side Effect 的操作
* 利用 CSRF-Token 在每次请求时需要携带 Token 来校验权限
* 在进行与钱相关的危险操作时需要再次输入密码（像支付宝、银行等应用的密码就会分为登录密码和付款密码）
