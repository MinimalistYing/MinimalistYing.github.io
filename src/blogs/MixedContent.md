# HTTPS Mixed Content

## 引子
从 Google 的 [这篇报告](https://transparencyreport.google.com/https/overview) 可以看出目前互联网上的 Web 站点 90% 以上都支持 HTTPS 访问，所以如果你的站点还不支持 HTTPS 现在是时候升级一下了。  

HTTPS 提升了 Web 站点的安全性，可以有效防止 On-Path Attacks (也被叫做中间人攻击)。通过对请求传输内容加密，即使你在公共场合不小心连接恶意 Wifi 流量被劫持，攻击者也无法获取一些更敏感的信息。  

如果你足够细心，那么可能发现了有时在 Chrome 地址栏左侧是一个感叹号而有时是一把小锁。如果是一把小锁说明你访问的站点是完全安全的，如果是一个感叹号说明可能哪里出了问题，可能是网站的证书已经过期，更大的可能是 HTTPS 的页面不正确的请求了 HTTP 的资源，这被称作 *Mixed Content* 。

## Mixed Content 的类型
Chrome 把 Mixed Content 分为 Active Mixed Content 以及 Passive Mixed Content 。  

Passive Mixed Content 指的是图片 / 视频 / 音频这三种多媒体资源，对应的分别是 `<img />` / `<video />` / `<audio />` 三种标签。由于这三种资源并不能与页面上的其它元素交互，所以哪怕通过不安全的请求加载也不会对站点的安全性造成太大威胁。所以目前 Chrome 对这些资源采取的策略是优先尝试升级，即使无法加载对应的 HTTPS 资源也不会将其拦截。所以页面上仍可以正常显示，但会在控制台中给出 Warning 信息。  

Active Mixed Content 指的是其余的类似脚本 / 样式表 / `<iframe>` / Ajax 请求等资源。因为这些资源的内容如果被劫持并被篡改，那么即使用户是通过 HTTPS 访问你的站点攻击者也可以进行包括修改页面内容，窃取隐私信息等恶意攻击，所以 Chrome 会将这些请求直接拦截并在控制台中给出 Error 信息。

## 怎么修复
首先最基本的在项目里全局搜索一下，把所有写死的 `http` 换成 `https`，当然你需要验证相应的资源是否支持通过 HTTPS 获取。  

此外，在页面中增加 `<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">` ，这条 Meta 信息可以告诉浏览器如果发现有对 Passive Mixed Content 的不安全请求时优先尝试升级为安全请求。  

也可以设为 `<meta http-equiv="Content-Security-Policy" content="block-all-mixed-content">` 来告诉浏览器阻止所有不安全的请求。  

最后在访问你的站点时打开控制台并留意其中给出的警告或错误信息，发现隐患及时修复即可。

## 参考
* [What is mixed content?](https://web.dev/what-is-mixed-content/)
* [Fixing-mixed-content](https://web.dev/fixing-mixed-content/)