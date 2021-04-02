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

## Link
`<link>` 标签除了用于最常见的加载样式表外还有很多其它用途：
```html
<!-- 当我们将多个 URL 定位到同样的页面时，可以通过这种方式告诉搜索引擎，避免搜索引擎重复收录内容 -->
<link rel="canonical" href="...">

<!-- 页面提供 RSS 订阅 -->
<link rel="alternate" type="application/rss+xml" title="RSS" href="...">

<!-- 浏览器 Tab 上显示的页面小图标 -->
<link rel="shortcut icon" href="..." type="image/x-icon">

<!-- ios 设备 safari 将网页添加到主屏幕时使用的图标 -->
<link rel="apple-touch-icon" href="..." sizes="...">

<!-- 提前对域名进行 DNS 解析，性能优化用，href 里填的只能是域名 -->
<link rel="dns-prefetch" href="//xxx.com">

<!-- 提前与服务器建立 TCP 连接，性能优化用 -->
<link rel="preconnect" href="//xxx.com">

<!-- 提前请求资源，性能优化用 -->
<link rel="prefetch" as="script" href="...">
<!-- 提前请求资源并加载，性能优化用 -->
<link rel="preload" as="script" crossorigin="anonymous" href="...">
<!-- 提前请求资源并加载渲染，性能优化用 -->
<link rel="prerender" href="...">
```

## 如何点击一图片上不同区域跳转至不同链接？
可借助 `<area>` 和 `<map>` 标签实现，支持 circle / rect / poly 三种形状，例如：
```html
<!-- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area -->
<map name="primary">
  <area shape="circle" coords="75,75,75" href="left.html" alt="Click to go Left">
  <area shape="circle" coords="275,75,75" href="right.html" alt="Click to go Right">
</map>
<img usemap="#primary" src="http://placehold.it/350x150" alt="350 x 150 pic">
```

## 对比 `stopPropagation` 和 `stopImmediatePropagation`
一言蔽之，`stopImmediatePropagation` 不仅会阻止事件继续传递（捕获或者冒泡）还会阻止当前 DOM 上已绑定的后续事件执行。  

实例见 [CodesandBox](https://codesandbox.io/s/stoppropagation-vs-stopimmediatepropagation-2zfxo)

## 浏览器窗口操作 API
需要注意的是以下几个 API，只有操作通过 `window.open` 打开的新窗口（且该窗口只有一个 Tab 页）时才会生效。  

所以稍作了解即可，用到的可能性不大。
```js
// 移动窗口
window.moveTo(x, y)
window.moveBy(x, y)

// 调整窗口尺寸
window.resizeTo(x, y)
window.resizeBy(x, y)
```

## 如何获取一个元素的准确位置？
返回值的具体含义见 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)。
```js
let elem = document.getElementById('id')
let rect = elem.getBoundingClientRect()
```

## 关于零宽字符（Zero-width space）`\uFEFF`
零宽字符是一种不占用宽度的空白字符，因为没有宽度所以对用户阅读信息不会造成任何影响。但是利用这种特性，可以在原信息中携带多余的加密信息，达到反爬虫或者增加版权信息的用途。例如：
> 你‏‏‍‎‏‍‌​‏‌‌‌‎‎‏好

如果你复制这段文字到浏览器控制台中可以发现间隔了很多星号，这就是文本中夹杂的零宽字符。

## JavaScript 中的 `this`
网上相关的文章有很多，这里仅根据个人理解做一个整理，方便记忆。  

JavaScript 中的 `this` 与很多其它面向对象的编程语言不同，它是一个动态的概念，而不是通常编程语言中固定的指向当前对象。最核心的一点是：
> 在 JavaScript 的函数中，`this` 的指向是由函数调用的方式动态决定的

也就是说，同样一个函数，调用方式不同，`this` 的值也会不同。例如：
```js
function foo () {
  console.log(this)
}

const obj = {
  foo,
}

foo() // window (Ps：在严格模式下会输出 undefined)
obj.foo() // obj

const binded = foo.bind(obj)
binded() // obj

foo.apply(obj) // obj
foo.call(obj) // obj
```
先大概整理一下，首先是函数直接调用，`this` 指向当前的全局对象（Ps: 浏览器中是 `window`，node 中是 `global` ）。另外由于这算是一个语言早期的设计错误，所以通常我们现在的代码会开启严格模式（`use strict`），在这种模式下 `this` 会指向 `undefined`。  

其次是在对象上去调用函数，例如 `obj.func()` ，显而易见此时的 `this` 指向的就是调用函数的对象本身。  

另外我们还有俩种方式去显示的改变函数的 `this` 指向。一种是 `func.apply(thisValue, args)` 以及 `func.call(thisValue, arg1, arg2, ...)` ，另一种是 `func.bind(thisValue)` 会返回一个绑定好 `this` 的新函数。这俩种情况下 `this` 都会指向我们显示传入的 `thisValue` 。  

下面我们来看一个例子，来展示 `this` 的这种动态行为会给我们带来什么影响：
```js
const obj = {
  a: 1,
  foo: function() {
    setTimeout(function() {
      console.log(this.a)
    }, 100)
  }
}

obj.foo() // undefined
```
对于新手来说这段代码是很让人疑惑的，从人的心智上来讲，第一反应肯定认为输出的是 `obj.a` 的值，也就是 `1` 而不是 `undefined`。在 ES6 之前要解决这种办法只有想办法去显示的指定 `this` 的值，所以如果你看过一些早些年的代码，以下这种写法想必会经常碰到：
```js
const obj = {
  a: 1,
  foo: function() {
    // that / self 等等
    // 这里其实是利用了 Closure 将正确的 this 存储在了另一个变量上
    const that = this
    setTimeout(function() {
      console.log(that.a)
    }, 100)
  }
}

obj.foo() // 1
```
好在，ES6 引入的箭头函数可以很好的帮我们解决这个问题，我们终于不用再不停的重复 `var that = this` 了。  

箭头函数的 `this` 等同于该函数定义时最接近的 Lexical Context 中的 `this` ，且是固定的，我们无法通过 `bind / call / apply` 等方法去改变其指向。同时这也意味着箭头函数不能像普通函数一样当作构造函数来使用。  

下面我们把上述例子改为使用箭头函数：
```js
const obj = {
  a: 1,
  foo: function() {
    setTimeout(() => {
      console.log(that.a)
    }, 100)
  }
}

obj.foo() // 1
```
可以说是完美，但是要注意箭头函数也可能会给我们带来新的问题：
```js
document.addEventListener('id', () => {
  console.log(this) // undefined 或者 window
})

document.addEventListener('id', function () {
  console.log(this) // dom 节点
})
```
最后，用一个关于 React 的经典问题来做一个实战演练，为什么我们需要在 Class Component 中的 Constructor 中去不停的 `this.handleClick = this.handleClick.bind(this)` ？

```js
class Button extends React.Component {
	handleClick() {
		console.log(this) // undefined
	}
	
	render () {
		return <button onClick={this.handleClick}></button>
	}
}
```
如果在页面上点击上述按钮会发现打印出来的是永远是 `undefined` 。  

出现这个问题的原因自然是因为 JavaScript 中的 `this` 的动态行为，所以要解决问题自然是想办法显示的指定函数的 `this`
```js
class Button extends React.Component {
	constructor() {
		// 借助 Function.prototype.bind
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick() {
		console.log(this)
	}

	// 或者使用 public class fields syntax 来声明函数
	handleClick = () => {
		console.log(this)
	}
	
	render() {
		return <button onClick={this.handleClick}></button>
	}

	// 借助箭头函数
	// 这种方式的缺点是每次 Button 组件的重绘都需要生成一个新函数
	// 当这个函数被当作 props 传入子组件时 可能会导致不必要的重绘
	// 所以更推荐采用先前的俩种方式
	// 但是当需要传递多余参数当时候可能不得不采用这种这种形式
	// 下面会给出当碰到渲染长列表的性能问题时如何进行优化
	render() {
		return <button onClick={e => this.handleClick(e)}></button>
	}
}

// 优化
class Alphabet extends React.Component {
	state = {
		num: null
	}
	// 通过将数据存放到 HTML 的 data-num 属性中来避免使用箭头函数引起的性能问题
	handleClick = e => {
		this.setState({
			num: e.target.dataset.num
		})
	}

	render() {
		return (
			<ul>
				{[1,2,3].map(num =>
					<li key={num} data-num={num} onClick={this.handleClick}>
						{num}
					</li>
				)}
			</ul>
		)
	}
}
```

## try 里面放 return，finally 还会执行吗？
```js
function foo(){
  try{
    return 0
  } catch(err) {

  } finally {
    console.log("a")
  }
}
console.log(foo());
```
依次输出 a、0，意味着会 finally 会优先执行。
```js
function foo(){
  try {
    return 0
  } catch(err) {

  } finally {
    return 1
  }
}
console.log(foo());
```
输出的是 1 而不是 0，说明 finally 中的 return 阻止了 try 中的 return。  

所以简单理解的话，在 JavaScript 中 finally 中的语句是保证一定会执行的。