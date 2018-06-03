export default [{
	date: "2017/8/3",
	content: "为了实现隐藏一个元素的滚动条但仍可以在鼠标移入其中时进行滚动操作，可以通过将其用父元素包裹，并将父元素设为 `overflow : hidden` 同时将其向右偏移或者增宽，这样可以使得其滚动条隐藏在父元素之下，类似 ```<div calss='wrapper' style='overflow : hidden; width : 200px'>  <div class='inner' style='max-height : 10px; overflow : scroll; width : 220px'></div>  </div>``` 的写法"
}, {
	date: "2017/8/10",
	content: "`::selection` 可用于改变文字选中时的字体颜色和背景色，IE9及以上和现代浏览器兼容"
}, {
	date: "2017/8/10",
	content: "想实现鼠标悬浮在一个父元素上能触发其子元素在 `:hover` 下的样式，之前的思路是通过借助jQuery `$(parent).hover(() => $(son).hover())` 来实现，今天突然发现原来的方法太复杂，其实只需要几行CSS即可实现想要的效果，类似 ```.parent:hover .son {  // 这里是鼠标悬浮在父元素上时子元素的样式  }``` 先前的思路在使用原生的Javascript时更难实现，因为原生的规范中并没有hover事件，与之相关的是鼠标的 `mouseenter/mouseleave/mousemove` 事件，而即使是在代码中触发了这些事件也是无法触发CSS的 `:hover` 状态的"
}, {
	date: "2017/8/13",
	content: "当一个 `display : inline-block` 元素的overflow被设为visible以外的值时，它的baseline位置会被从默认的字符x的底线位置修改为下外边沿，与此同时同一包含块的其它 `display : inline-block` 元素会被迫向下偏移来和这个元素对齐，遵循IFC(Inline Formatting Contexts)原则"
}, {
	date: "2017/8/15",
	content: "当一个 `position: absolute` 的绝对定位元素的父元素的 `overflow` 值被设为非 `visible` 时，会出现该定位元素超出父元素的部分会被遮盖掉无法显示的情况，暂时对这种问题的解决方式只知道将父元素改为 `overflow: visible` 或者尽量保证定位元素不会超出父元素的边界"
}, {
	date: "2017/8/16",
	content: "当一个元素被设为 `display: flex` 时，它会被当作一个Flex Container，而它的所有子元素都会被当作Flex Item，并且这时候在其子元素上设置 `float | clear | vertical-align` 的值都是无效的"
}, {
	date: "2017/8/16",
	content: "一种将全部元素reset为 `box-sizing: border-box` 的方法 ```html {  box-sizing: border-box;  }  *, *:before, *:after {  box-sizing: inherit;  }``` 可能会有更好的方法？详情可见[这篇文章](https://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/)"
}, {
	date: "2017/8/27",
	content: "可以通过给锚点设置一个向上的负偏移量来实现调至锚点位置时不会将锚点至于页面最顶部(避免被顶部所固定的Header遮挡)，类似: ```a {  position: relative;  top: -66px;  }```"
}, {
	date: "2017/9/18",
	content: "一种提高使用transform以及opacity来做过度效果性能的思路[FLIP](https://aerotwist.com/blog/flip-your-animations/)"
}, {
	date: "2017/11/1",
	content: "关于实现背景透明但文字不透明的效果，首先考虑的是使用 `opacity` 但其子元素都会继承这个属性，且无法单独为其子元素设置一个值，所以不可行。如果只是背景色透明的话，使用 `rgba()` 来设置透明 `background-color` 是一种不错的方法，兼容至IE9。"
}, {
	date: "2017/11/17",
	content: "关于 'box-sizing: content-box' 以及 'box-sizing: border-box' 前者其实是W3C提出，后者是早期IE6、7quirk mode下的盒模型实现。但后来人们发现其实后者更符合人的逻辑，所以加了这个属性。对于 `content-box` 盒子宽度等于 `width` + `padding` + `border` 对于 `border-box` 盒子宽度就等于所设的 `width`  减去 `padding` 以及 `border` 才是真正展示内容的宽度"
}, {
	date: "2017/11/24",
	content: "实现文字模糊效果 ```{  color: transparent;  text-shadow: #111 0 0 5px; }``"
}, {
	date: "2017/12/20",
	content: "当 `display: inline-block` 的元素间有换行时，浏览器的渲染结果会带有间隙。这是由于浏览器会将这个换行符当作字符，所以会占有一个的字符大小的宽度。解决方法有很多，个人较喜欢 `font-size：0`。"
}, {
	date: "2018/1/17",
	content: "通过CSS3的 `vh(当前视窗高度百分比)`  `vw(当前视窗宽度百分比)`  `vmin`  `vmax` 这几个熟悉来实现基于浏览器视窗高度的布局，例如全屏遮罩，左侧导航100%自适应当前视窗高度等"
}, {
	date: "2018/3/1",
	content: "类似 `input/img/iframe` 等内部无法容纳其它内容的元素，无法利用伪元素 `::after/::before` 来实现特定样式"
}]