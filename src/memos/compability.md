Edge / IE11 / Safari 好像会试图去识别页面上的数字是否像电话号码  
如果像的话会在这些数字下加一个下划线，并使其可点击打开Skype之类的应用拨号(有些邮箱以及地址也同理)  
想禁用这一特性可在 `<head>` 中加上
```html
<meta
	name="format-detection"
	content="telephone=no,email=no,address=no"
>
```

---

关于
```html
<meta http-equiv="X-UA-Compatible" content="IE=edge">
```
详情参看[这个回答](https://stackoverflow.com/questions/6771258/what-does-meta-http-equiv-x-ua-compatible-content-ie-edge-do)

---

Andriod 中调用 WebView 来访问 H5 页面时 HTML5 的 DOMStorage 也就是  
`localStorage|sessionStorage` 默认是关闭的  
需要通过 `settings.setDomStorageEnabled(true)` 来开启  
未开启的话会碰到在 H5 中读取 localStorage 为 null 的问题

---

Andriod 部分机型的 WebView 不支持通过
```js
window.location.replace()
```
来实现无法返回的页面中转操作，
因此建议优先考虑采用 History API 来实现相应功能
```js
window.history.replaceState({}, title, url)
```

---

手机端的 H5 页面长按会弹出复制分享的菜单，如果想要禁用 IOS 可以通过
```css
// 这个属性会导致IOS上的input能唤起浏览器键盘 但无法聚焦input框
// 最终结果就是无法正常输入!!!
// 感觉这种禁用需求应该直接予以否决
user-select: none; 
-webkit-touch-callout: none;
```
Andriod 通过
```js
window.oncontextmenu = e => e.preventDefault()
```

---

在联调 Andriod WebView 内嵌 H5 页面时发现一个问题，页面的 `font-size|line-height`  会随着系统字体大小的调整而缩放导致布局错位  
比如设置一个div的`font-size: 14px`当手机字体设为超小时  
通过 Chrome inspect WebView 可能会发现 Computed Style 中显示的实际 `font-size` 为 `14*0.86=12.04px`  
在Andriod端通过`webview.getSettings().setTextZoom(100)`可完美解决问题

---

部分 Andriod 4.4.4 版本的机型 WebView 不支持 CSS3 的 `transform` 加了前缀 `-webkit-transform` 也不行  
但是手机自带的浏览器应该是支持带前缀的形式的，只是 WebView 中不支持  
询问 Andriod 的同学得知 WebView 采用的浏览器内核和手机自带浏览器的内核还是有差别的

---

在用 Vue 开发 IOS WebView 内嵌 H5 SPA 页面时碰到点击APP返回上一页时出现页面白屏的问题    
需要滑动一下页面，内容才会显示  
具体问题以及解决方式可以参考[issue](https://github.com/vuejs/vue/issues/5533#issuecomment-343864468)  
导致这个问题的主要原因应该还是在返回时仍去异步加载数据，最佳解决方式应该是缓存相应的异步请求数据

---

在各类 Dom 事件中可以通过
```js
// e.path Chrome采用 非标准属性
// e.composedPath() 标准属性 最新的 FF Chrome Safari都兼容
const path = e.path || (e.composedPath && e.composedPath())

// 如果需要兼容更低版本的浏览器 可以自己去遍历
function getPath(e) {
	const path = []
	let dom = e.target || e.srcElement
	while (dom) {
		path.push(dom)
		
		// 为了和composedPath()行为一致
		if (dom.tagName === 'HTML') {
            path.push(document)
            path.push(window)

            return path
       }

		dom = dom.parentNode
	}
}
```
去获取这个事件从触发事件的 Dom 节点开始到 Window 的 Dom 路径
