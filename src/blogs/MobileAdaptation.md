# 移动端自适应布局
Emmmmm...  

其实下面讨论的布局等问题不仅仅存在于移动端，所以感觉标题改为不同分辨率 / DPR 屏幕下的自适应布局可能会更合适。

这是一段漫长的学习之路，我会慢慢完善相关内容。

## 基础
首先我们需要先了解一些相关的背景知识。

### 物理像素(Physical Pixels)
显示屏上实际的像素点，通常来说一块显示屏上的物理像素越多，显示的效果就会越清晰。  

如果更通俗点来解释的话，一个物理像素就是一个可以发光的点，成千上万个这样的点同时发出不同颜色的光就构成了我们眼中屏幕上的画面。

### PPI(Pixels Per Inch)
每英寸的物理像素数，通常用来比较屏幕的像素密度。  

计算公式 `√(水平像素数^2 + 垂直像素数^2)/屏幕尺寸`，所以简单来说相同尺寸的屏幕，PPI 越大，分辨率越高。  

稍微提一下，屏幕的尺寸指的是屏幕对角线的英寸长度。下面我们以 IPhone X 为例，分辨率 `1125 * 2436`，屏幕尺寸 `5.8 Inch` ,套用公式 `√(2436^2 + 1125^2)/5.8` 计算出来的 PPI 取整就是 `463`（这个比苹果官方的数据 `458` 大了一点，估计是因为刘海屏的原因吧）。

### 逻辑像素(Logical Pixels)
也被称作设备独立像素(Device Independent Pixel)。  

对于前端来讲也就是在 CSS / JavaScript 中设置的像素。不同的设备可能会用不同数量的物理像素去显示一个逻辑像素。  

还是拿 IPhone X 举例，它的物理像素分辨率为 `1125 px * 2436 px`，而逻辑像素分辨率为 `375 pt * 812 pt`。也就是说我们在 IPhone X 的浏览器中通过 `window.innerWidth` 获取到的值是 `375 px`，而不是实际的物理像素 `1125 px`。

### DPR(Device Pixel Ratio)
设备像素比，计算公式 `设备像素比 = 物理像素 / 逻辑像素`。  

继续拿 IPhone X 举例，它的 DPR 是 `1125 / 375 = 3`。  

在 JavaScript 中我们可以通过 `window.devicePixelRatio` 获取到当前设备的 DPR。在 CSS 中则可以通过多媒体查询来根据 DPR 设置不同的样式：
```css
@media (-webkit-min-device-pixel-ratio: 2) {
  font-size: 16px;
}
@media (-webkit-min-device-pixel-ratio: 1) {
  font-size: 12px;
}
```

### Viewport
```html
<!-- 拼多多 -->
<meta content="width=device-width,initial-scale=1,user-scalable=no" name="viewport">

<!-- 淘宝 -->
<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">

<!-- 京东 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no, viewport-fit=cover">

<!-- 网易 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
这个关于 `viewport` 的标签可以说是适配移动端的 H5 页面必备的。各大厂的设置大同小异（Ps: 除了网易首页可能为了让有些老年用户可以放大页面看新闻没有禁止用户缩放外）。  

`width=device-width,initial-scale=1` 如果没有这行配置，浏览器会自动更具页面的宽度进行缩放，避免出现横向滚动条。这也是我们在移动端访问未适配过的 PC 网站会发现页面被缩放的原因。  

`minimum-scale=1,maximum-scale=1,user-scalable=no` 是为了确保用户无法通过在触屏上俩指往外拉的操作来缩放页面，这样可以使我们的 Web App 在移动端看起来和原生应用的感觉差不多。

## 高清屏给开发者带来的影响是什么？
看完上面的这些概念可能大家还是不明白这么多关于屏幕的东西对我们开发者来说有什么影响呢？下面我会试着通过几个例子更直观的说明一下。  

影响最大的首先应该是图片（SVG 格式的图片不会存在下面说的的问题），同一样一张 `400px * 400px` 的图片放到宽高设为 ` 400px * 400px` 的 `img` 标签下展示，在高清屏（也就是 DPR >= 2 以上的屏幕），肉眼可以明显感觉到图片显示有点模糊。  

如果屏幕的 DPR 是 2 的话，我们需要在 `400px * 400px` 放入 `800px * 800px` 的图片才会显得清晰。这个也就是现代所谓高清屏带来的好处，同样的物理尺寸，更高的 PPI，意味着更多的像素点，给人眼的感觉就是图像更加清晰，没有颗粒感。  

大家手上如果有俩个 DPR 分别为 1 和 2 的显示器的话，访问一下京东或者淘宝的首页就可以看到。在俩块屏幕上访问，`img` 标签加载的图片资源是不一样的，DPR 为 2 的高清屏下会加载分辨率为逻辑像素俩倍的图片。  

Ps: 截至现在 (2020 年 3 月)，京东的商品详情页应该还没有做过特殊的处理，所以大家用 Mac 访问时可以很明显的感觉到详情页上的图片会变得有些模糊。  

如果大家还是想不明白为什么会这样的话，我再举一个例子，IPhone X 的逻辑像素是`375 pt * 812 pt`，而实际上它的高清壁纸的分辨率得是 `1125 px * 2436 px`，这样才不会显得图片模糊。大家如果手机上还存有 5s 时期的壁纸的话在 IPhone X 上浏览可以很明显的发现原来在 5s 上的高清壁纸在 IPhone X 上看的确有点模糊,因为 5s 的 DPR 是 2,而 IPhone X 的是 3。

另外一个就是老生常谈的如何在移动端实现 1px 的边框问题。Ps: 其实在 PC 端如果你的显示器是高清屏的话也会碰到这个问题，但是可能因为移动端屏幕比较小，所以感觉起来最明显。实际上我看了下淘宝 / 京东等网站都仅仅在移动端页面做了一些特殊处理。

简单来说就是设计师通常会在设计稿中给出 1px 的细线，但是如果我们用 CSS 的`1px` 去实现会发现在 DPR >= 2 的屏幕上显示的线条会比设计稿中的要粗一些，因为在这些屏幕上实际用了俩个以上的物理像素去显示。  

在设计师的像素眼里这种差异是难以接受的，大家可以看看[这篇博客中的](https://blog.csdn.net/bbnbf/article/details/51580569)的对比截图来对这个问题有一个更直观的感受。

解决这个问题的关键是在 DPR = 2 的屏幕上，我们需要一个 `0.5px` CSS 像素的边框。推荐方式如下：
```css
@media (-webkit-min-device-pixel-ratio: 1) {
  .normal-border {
    border-top: 1px solid black;
  }
}
/* 通过伪元素 transform: scale(0.5) 后实现 */
@media (-webkit-min-device-pixel-ratio: 2) {
  .retina-border {
    position: relative;
  }
  .retina-border:before {
    content: '';
    border: 1px solid black;
    transform: scale(0.5);
    transform-origin: 0 0;
    width: 200%;
    height: 200%;
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
  }
}
```

## REM 布局
大概这是手淘推出的一种移动端布局方案，详情见[lib-flexible](https://github.com/amfe/lib-flexible)。  

其实这只能算是一种为了兼容性的过渡性方案，其最新的官方文档也建议不要再使用这种方法（Ps：这个库应该也很久没有人维护了），不考虑兼容性的话更推荐使用 `vw` `vh` 来实现移动端布局。 

其简单原理如下
> 根据不同的屏幕去通过 JavaScript 动态改写 `<meta>` 标签，给 `<html>` 元素添加 data-dpr 属性，并且动态改写 data-dpr 的值，给 `<html>` 元素添加 font-size 属性，并且动态改写 font-size 的值。

然后我们在写一些固定宽度时不再使用 `px` 而是采用 `rem` 为单位，由于 `rem` 是以根元素的字体大小作为参考的相对单位，这样就做到了不同的屏幕下固定宽度显示的比例相同的效果。

## 移动端的字体设置
来自 [AlloyTeam](https://github.com/AlloyTeam/Mars/blob/master/solutions/font-family.md)
```css
body {
    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC","Helvetica Neue",STHeiti,"Microsoft Yahei",Tahoma,Simsun,sans-serif;
}
```

## 参考文档
* [https://github.com/amfe/article/issues/17](https://github.com/amfe/article/issues/17)
* [https://zhuanlan.zhihu.com/p/26374866](https://zhuanlan.zhihu.com/p/26374866)