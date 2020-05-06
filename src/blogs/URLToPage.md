# 从输入 URL 到浏览器显示页面发生了什么
对于这个问题相信大家或多或少都能答上几点，但是估计很少有人能详细的描述整个过程。  

作为一名 Web 开发者来说，深入理解在浏览器背后发生的事情对于日常开发或者 Debug 来说都很有意义。  

下面我会试着尽可能详细的整理一下从我们输入 URL 到浏览器显示页面的整个流程。

## 浏览器本地缓存

## DNS
浏览器缓存->系统缓存(hosts 文件)->路由器缓存->IPS服务器缓存，根域名服务器缓存，顶级域名服务器缓存，主域名服务器缓存

## HTTP 请求以及 HTTP 缓存
三次握手四次挥手

## 解析 HTML
css js

## 构建 DOM 树

## 重绘和回流

## 参考文档
* [http://taligarsiel.com/Projects/howbrowserswork1.htm](http://taligarsiel.com/Projects/howbrowserswork1.htm)
