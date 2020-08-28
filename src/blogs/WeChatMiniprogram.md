# 初识微信小程序

## 序
最近开始接手公司的一个微信小程序项目，早先在小程序刚上线的时候自己动手做了个小东西试试水，但是由于不符合个人小程序的运营规范所以只能自己平日用用体验版，无法正式上线。这次借着公司的这个机会，也希望在完成工作的同时能更深入的学习一下小程序开发的相关技术，所以在此稍作记录。

## 问题及总结

### wx.request 会默认的设置 Content-Type
默认值是 `application/json`，大多数情况下没有问题。但是如果服务器端做了一些更严格的校验，例如限制了 `GET` 请求的 `content-type` 只能为 `application/x-www-form-urlencoded` 就会导致请求出错，平时注意留意一下即可。

### 小程序的请求不会默认携带 Cookie
比较奇怪为什么微信官方会有这个限制，毕竟鉴权等信息还是通过 Cookie 传递方便。找到了一个库 [weapp-cookie](https://github.com/charleslo1/weapp-cookie) 来解决这个问题。

### wx:key
在 WXML 中使用 `wx:for` 时需要绑定 `wx:key`，原理应该和 Vue 和 React 的一致。但是具体语法有所不同，有如下俩种形式：
> 字符串，代表在 for 循环的 array 中 item 的某个 property，该 property 的值需要是列表中唯一的字符串或数字，且不能动态改变。

> 保留关键字 *this 代表在 for 循环中的 item 本身，这种表示需要 item 本身是一个唯一的字符串或者数字。

### wx.chooseImage 会触发页面的 onShow 事件
可能是由于唤起相机时会导致小程序切至后台，然后再次进入时就会触发 onShow 事件。

### 怎么在微信小程序中使用 svg
由于 WXML 自身不支持 `svg` 标签，可以通过 `background-image` 的 `url()` 将 svg 图片转为 Data URL 来放入其中使用。   
Ps: [在线 SVG 转 Data Url](https://codepen.io/jakob-e/pen/doMoML)

## Tips
* Warning 信息也需要留意，可能会导致小程序执行错误。