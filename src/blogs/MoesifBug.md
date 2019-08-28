# 记一次 Chrome 更新导致插件故障引发的问题

## 起因
由于我司现有的系统前后端都部署在同一域名下，所以线上不存在跨域，当然后端项目就不会进行相关的 CORS 配置啦。  

但是，我们本地去请求预发地址进行联调时就必然会碰到跨域问题。这个时候我们用了一个 Chrome 插件 Moesif 来绕开浏览器的跨域限制。  

之前一直工作的很好，本地可以正常访问线上的接口，今天突然发现跨域请求报错了。错误信息如下  
```
Access to fetch at 'https://xxx.com/api/v1/apps' from origin 'http://localhost:8870' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

## 探究原因
出现这个错误时我的第一想法是会不会后端做了什么改动，因为此时我的另外一个项目是可以正常跨域的。  

但是仔细想想又不对，因为 Moesif 插件是通过在所有响应的 ReponsseHeader 中加上相关的 Access-Control-Allow-xxx 响应头来绕开浏览器限制的。  

所以后端应该没有什么能力影响到插件的工作，还有一点奇怪的是，GET 跨域请求可以通过, 但是其它的请求就不行。  

要解决问题当然得先找到问题发生在哪，所以我开始用排除法来去掉一些猜测。  

首先我想确定问题究竟是不是由于后端的改动导致的，我让同事帮忙在她的项目中本地请求了一下出问题的地址，发现没有问题。  

那么基本上就可以确定故障的发生与后端无关，接下来我把自己的 Moesif 配置和同事对比了一下，发现都是相同的配置，那肯定也不是我插件配置出错。

相同的 Moesif 配置，相同的后端请求地址，她的项目没问题而我的有问题，那是不是我的代码有错误呢？  

接着又让同事在本地运行了一下我的项目，发现果然也有跨域问题。  

但是我试着切到以前能正常请求的分支，发现还是有问题。这就很奇怪了，为什么相同的代码突然就不能工作了呢。  

由于我自己在项目中对原生的 Fetch API 进行了一层封装，而同事项目里没有。会不会是我的封装出了什么问题呢？最好的方法当然是对比一下封装前后的请求有什么不同，比较后我发现原生 Fetch 也能正常请求。这个时候基本可以确定是我的封装出了问题。  

通过打断点的方式，我发现俩者最终的区别仅在于我封装好发起的请求会多设置一个请求头 Content-Type: application/json 。尝试着手动把该请求头去掉，Bingo !  

问题探究到这里基本已经确定了导致故障的原因，但还是很奇怪。为什么？  
为什么加个请求头就会有问题？  
为什么之前都有这个请求头就没问题？  

去 MDN 上查找发现
> HTTP headers let the client and the server pass additional information with an HTTP request or response. An HTTP header consists of its case-insensitive name followed by a colon (:), then by its value. Whitespace before the value is ignored.


我的请求头写法明明没问题啊，再考虑到 GET 请求可以其它请求不行。那么会不会是插件对需要 Preflight 的跨域请求处理出了问题呢？  

最后点开 Moesif 在 Chrome 上的插件页面，果然发现有这么一行
> Update: Due to how Chrome handling CORB (thus impact CORS) is in flux, we received reports that Chrome version 76.x may have caused some issues. We are investigating. Thank you for your patience. 

Emmmmmm......  

最终结论就是由于 Chrome 最近的版本更新了一些处理 CORS 的机制，导致插件在碰到 Preflight 跨域请求时不能正常绕开限制了。

## 总结
暂时的解决办法只有先统一的去掉请求携带的 Request Header ，静待插件作者更新修复问题。如果一直不修复的话，只好让后端配合支持一下预发环境跨域请求了。  

感觉下次碰到这类问题要自信一点，首先去看一看相关库或插件的文档或 Issue 页面，看看是不是库或插件自身出了问题。不然 Debug 起来还是比较费时的。