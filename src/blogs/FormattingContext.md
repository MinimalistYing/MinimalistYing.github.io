# Formatting Context
以前经常听到说 BFC / IFC，但是一直只是知其然不知其所以然，最近忙里偷闲去深入学习了一下相关知识并在此做个整理。  

所谓 BFC / IFC 都是属于 Formatting Context 的一种，最新的还有 Flex Formatting Context 以及 Grid Formatting Context。直译过来就是*格式化上下文*，浏览器会依据不同的上下文来排放内部的元素。  

如下三个最典型的场景会利用到 BFC：
* 将浮动元素包裹在内避免高度塌陷
* 排除外部的浮动元素
* 避免垂直方向的外边距合并

## IFC - Inline Formatting Context
行内格式化上下文规定了浏览器如何放置其中的行内元素，特点是当内容过长时可以跨行展示，并且盒模型的外边距 / 内边距 / 边框属性只会在水平方向把俩侧的内容推开，而不会对垂直方向的布局造成影响。  

另外可以通过 `vertical-align` 来设置行内元素的垂直位置，`text-align` 来设置行内元素的水平位置。

## BFC — Block Formatting Context
着重来看一下块级格式化上下文，首先 `<html>` 根元素会新建一个 Initial Block Formatting Context，也就是说默认的页面上在正常流中的元素会依照 BFC 来进行布局。这也是为什么有时候我们会主动的去新建一个 BFC 的原因，因为这样可以建立一个不受干扰相对独立的布局区域。一块 BFC 会包含内部所有的元素，例如元素的浮动，上下外边距的合并都只会发生在一个 BFC 内，不会影响到外部的布局。  

除了根元素外，下面这些情况都会建立一个新的 BFC（只列举了常见的）：
* 设置了 `float` 属性的浮动元素
* 绝对定位元素 `position: fixed | sticky | absolute`
* Grid Items 以及 Flex Items
* 设置了 `display: flow-root` 的元素
* `overflow` 属性不是 visible 的块级元素
  
利用到 BFC 的典型场景可见 [MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context)