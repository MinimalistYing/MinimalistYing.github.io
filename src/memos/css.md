为了实现隐藏一个元素的滚动条但仍可以在鼠标移入其中时进行滚动操作，
可以通过将其用父元素包裹，并将父元素设为
```css
overflow: hidden;
```
同时将其向右偏移或者增宽，这样可以使得其滚动条隐藏在父元素之下，类似
```html
<div calss="wrapper" style="overflow: hidden; width: 200px">
	<div class="inner" style="max-height: 10px; overflow: scroll; width: 220px"></div>
</div>
```
的写法

---

想实现鼠标悬浮在一个父元素上能触发其子元素在 `:hover` 下的样式，
之前的思路是通过借助jQuery `$(parent).hover(() => $(son).hover())`来实现，
今天突然发现原来的方法太复杂，其实只需要几行CSS即可实现想要的效果，类似 
```css
.parent:hover .son {
	// 这里是鼠标悬浮在父元素上时子元素的样式
}
```
先前的思路在使用原生的Javascript时更难实现，因为原生的规范中并没有hover事件，
与之相关的是鼠标的 `mouseenter/mouseleave/mousemove` 事件，
而即使是在代码中触发了这些事件也是无法触发CSS的 `:hover` 状态的

---

当一个
```css
display: inline-block
```
元素的overflow被设为visible以外的值时，它的baseline位置会被从默认的字符x的底线位置修改为下外边沿，
与此同时同一包含块的其它
```css
display : inline-block
```
元素会被迫向下偏移来和这个元素对齐，遵循IFC(Inline Formatting Contexts)原则

---

当一个 `position: absolute` 的绝对定位元素的父元素的 `overflow` 值被设为非 `visible` 时，
会出现该定位元素超出父元素的部分会被遮盖掉无法显示的情况，
暂时对这种问题的解决方式只知道将父元素改为 `overflow: visible` 或者尽量保证定位元素不会超出父元素的边界

---

当一个元素被设为 `display: flex` 时，它会被当作一个Flex Container，
而它的所有子元素都会被当作Flex Item，并且这时候在其子元素上设置 `float | clear | vertical-align` 
的值都是无效的

---

一种将全部元素reset为 `box-sizing: border-box` 的方法
```css
html {
	box-sizing: border-box;
}
*, *:before, *:after {
	box-sizing: inherit;
}
```
可能会有更好的方法？详情可见[这篇文章](https://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/)

---

可以通过给锚点设置一个向上的负偏移量来实现调至锚点位置时不会将锚点至于页面最顶部(避免被顶部所固定的Header遮挡)，
类似: 
```css
a {
	position: relative;
	top: -66px;
}
```

---

一种提高使用transform以及opacity来做过度效果性能的思路[FLIP](https://aerotwist.com/blog/flip-your-animations/)

---

关于实现背景透明但文字不透明的效果，首先考虑的是使用 `opacity` 但其子元素都会继承这个属性，
且无法单独为其子元素设置一个值，所以不可行。如果只是背景色透明的话，
使用 `rgba()` 来设置透明 `background-color` 是一种不错的方法，兼容至IE9。

---

关于 `box-sizing: content-box` 以及 `box-sizing: border-box`  
前者其实是W3C提出，后者是早期IE6、7quirk mode下的盒模型实现。但后来人们发现其实后者更符合人的逻辑，所以加了这个属性。  
对于 `content-box` 盒子宽度等于 `width` + `padding` + `border`   
对于 `border-box` 盒子宽度就等于所设的 `width`  减去 `padding` 以及 `border` 才是真正展示内容的宽度

---

实现文字模糊效果
```css
{
	color: transparent;
	text-shadow: #111 0 0 5px;
}
```

---

当 `display: inline-block` 的元素间有换行时，浏览器的渲染结果会带有间隙。
这是由于浏览器会将这个换行符当作字符，所以会占有一个的字符大小的宽度。
解决方法有很多，个人较喜欢 `font-size：0`。

---

通过CSS3的 `vh(当前视窗高度百分比)`  `vw(当前视窗宽度百分比)`  `vmin`  `vmax` 
这几个熟悉来实现基于浏览器视窗高度的布局，例如全屏遮罩，左侧导航100%自适应当前视窗高度等

---

类似 `input/img/iframe` 等内部无法容纳其它内容的元素，无法利用伪元素 `::after/::before` 来实现特定样式

---

可以通过mask属性来实现对一块区域的遮罩效果
兼容性不佳，目前只有webkit内核支持
Ps:知乎在内容收起时的渐变透明文字遮罩的实现方式
```css
-webkit-mask-image: linear-gradient(#1a1a1a calc(100% - 8rem),transparent calc(100% - 2.8rem));
-webkit-mask-size: 100% 100%;
```

---

CSS 中如下几个伪类选择器中 n 的值不止支持数字类型还支持关键字 (odd / even) 以及公式 (an + b)
* nth-child(n)
* nth-last-child(n)
* nth-of-type(n)
* nth-last-of-type(n)

例如 `p:nth-child(even)` 可以选择所有父元素中下标为偶数的 `<p>` 元素  
又例如 `p:nth-child(3n+1)` 可以选择所有父元素中下标为 3 的倍数加 1 的 `<p>` 元素

---

假设有如下俩个锚
```html
<a>不带 href</a>
<a href="www.xxx.com">带有 href</a>
```
设置如下样式
```css
a:link {
	color: red;
}
```
只有第二个真正代表链接第锚标签会变为红色  
如果通过
```css
a {
	color: red;
}
```
来设置未访问链接的字体颜色会发现页面上所有的 `<a>` 都字体都变成了红色

---

Css 伪类也可以结合起来使用，例如
```css
a:link:hover {
	color: red;
}
a:visited:hover {
	color: green;
}
```
可以使得鼠标悬浮未访问过的链接时字体为红色，悬浮访问过的链接字体为绿色

---

随意使用通配符来设定样式可能会引来问题，例如有如下样式
```css
* {
	color: red;
}
p {
	color: black;
}
```
我们希望页面上的段落中字体颜色都为黑色  
由于样式继承的存在，假设我们的文档结构如下
```html
<p>...<em>...</em>...</p>
```
我们会认为 `<em>` 会继承 `<p>` 的样式，字体颜色同样为黑色  
但结果可能会出乎意料 `<em>` 的字体颜色会显示为红色  
这是因为继承而来的样式没有特殊性，而通配符设置的样式特殊性为 0  
哪怕是 0 特殊性仍然会覆盖掉没有特殊性的样式  
所以不建议使用通配符来设定页面的样式

---

为什么说使用无单位的数字来设置 `line-height` 最好  
```html
<div style="font-size: 12px; line-height: 1.5em; width: 60px;">
	<p style="font-size: 40px;">段落内容</p>
<div>

<div style="font-size: 12px; line-height: 1.5; width: 60px;">
	<p style="font-size: 40px;">段落内容</p>
<div>
```
上述代码中的俩个 `div` 样式差别仅在于 `line-height`。  
但是可以发现第一个段落中的文字会重叠在一起，因为当使用带单位的值时子元素继承的 `line-height` 是计算值而不是比例。所以第一个段落的实际计算行高为 `18px(12px * 1.5em)` 而字体大小为 `40px`，第二个段落的行高为 `60px(40px * 1.5)` 字体大小与第一段相同。
所以第一段中的文字会发生重叠，为了避免这种问题通常建议使用无单位的数字来设置 `line-height`。  
Ps: `line-height` 的值最好不要设置小于 1.5 ，这样才能保持文本良好的可读性

---

现在 CSS 提供了原生的全局变量支持(IE 不兼容)
```
:root {
	--somecolor: #666;
	--someshadow: #ddd 0 0 6px;
}

div {
	background: var(--somecolor);
	box-shadow: var(--someshadow);
	color: var(--none, red); /* 支持设置默认值 */
}
```

---

`z-index` 属性只有设置在定位元素也就是 `position` 不是 `static` 的元素上才会生效

--- 

关于清除浮动的各种方法以及其适用场景  
[what-methods-of-clearfix-can-i-use](https://stackoverflow.com/questions/211383/what-methods-of-clearfix-can-i-use)

---

可以借助 `position: sticky` 来快速实现元素滚动吸顶功能

---

`visibility` 属性可继承，借助这个特性可以实现隐藏父节点，显示子节点的效果。