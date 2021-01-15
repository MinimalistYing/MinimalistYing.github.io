# 深入学习 Winter 老师的重学前端教程后产出的高阶学习笔记（二）

## CSS 函数
可以通过 `attr()` 来在样式中获取到 Dom 上的属性，例如：  
```css
/*
<p data-foo="hello">world</p>
含有 data-foo 属性的 dom 元素会在之前显示一个与其属性值相同的伪元素
*/
[data-foo]::before {
  content: attr(data-foo) " ";
}
```
可以借助 `min()` `max()` `clamp()` 来设置动态计算但是限定了极限的值：
```css
/*
当视窗宽度小于等于 400px 时宽度为视窗宽的一半，但是当视窗宽度超出时限定了最大宽度为 200px
当视窗宽度大于等于 200px 时高度为视窗高的一半，但是当视窗高度过小时限定了最小高度为 100px
字体大小会根据视窗宽度变化，但是最小为 12 px, 最大为 24px
*/
.example {
  width: min(50vw, 200px);
  height: max(50vh, 100px);
  font-size: clamp(12px, 2.5vw, 24px);
}
```
在 `filter` 中可以借助多种函数调整元素的显示效果：
```css
img {
  /* 对比度 */
  filter: contrast(50%);
  /* 模糊 */
  filter: blur(5px);
  /* 亮度 */
  filter: brightness(150%);
  /* 灰阶 */
  filter: grayscale(100%);
  /* 透明 */
  filter: opacity(.5);
  /* 类似老照片的效果 */
  filter: sepia(100%);
}
```

## Meta 信息
除了语义标签，还有专门的一类元信息标签供浏览器或者搜索引擎等阅读，用于描述文档自身的一些额外信息，通常都包含在头部的 `<head>` 标签中：
```html
<html lang="zh-CN">
  <head>
    <!-- 用于在浏览器的 Tab 上展示，也是收藏页面时默认使用的标题 -->
    <title>页面标题</title>

    <!-- 告知浏览器当前页面采用的编码方式，如果不设置很有可能会导致页面显示乱码 -->
    <!-- 建议采用 HTML5 最新支持的第一种写法 -->
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

    <!-- 尝试将页面中的 http 请求自动升级为 https 请求 -->
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">

    <!-- 详情参看(https://stackoverflow.com/questions/6771258/what-does-meta-http-equiv-x-ua-compatible-content-ie-edge-do) -->
    <!-- 只考虑兼容现代浏览器的话不建议添加如下标签 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <!-- 页面内容的相关信息，通常会被搜索引擎用于 SEO -->
    <meta name="description" content="....">
    <meta name="keyword" content=".....">

    <!-- 禁用 Edge / IE11 / Safari 试图去识别页面上的数字是否像电话号码的特性 -->  
    <!-- 浏览器会为这些数字下加一个下划线，并使其可点击打开Skype之类的应用拨号(有些邮箱以及地址也同理)  -->
    <meta name="format-detection" content="telephone=no,email=no,address=no">

    <!-- 试图修改 HTML 文件的 Cache-Control 策略 -->
    <!-- 好像并不是很可靠，不是很确定浏览器优先采用的是这个策略还是服务器返回的策略 -->
    <meta http-equiv='Cache-Control' content='no-store'>
  </head>
  <body></body>
</html>
```