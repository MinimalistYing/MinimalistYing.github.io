export default [{
	date: `2017/8/1`,
	content: `
为了使
\`\`\`css
display: inline-block
\`\`\`
在IE8中起作用，必须在文档开头加上
\`\`\`html
<!DOCTYPE html>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
\`\`\`
`
}, {
	date: `2017/8/2`,
	content: `
IE8中的伪元素只支持类似 \`:after\` 的写法，不支持 \`::after\` 的写法
`
}, {
	date: `2017/8/9`,
	content: `
IE8切换为兼容性视图模式时会将原User-Agent中包含的\`MSIE8.0\`转变为 \`MSIE7.0\`
所以在通过UA来判断IE版本时尤其要注意
`
}, {
	date: `2017/8/13`,
	content: `
可以通过
\`\`\`css
filter: Alpha(opacity = ?)
\`\`\`
来在IE7-8中兼容CSS3的 \`opacity\` 属性
`
}, {
	date: `2017/8/16`,
	content: `
在IE8下如果在 \`table-layout: auto\` 的表格中为单元格设置
\`\`\`css
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
\`\`\`
想实现单元格内文字过长时出现...并截断多余内容会发现无效，反而表格会被内容撑宽，破坏原有布局。
要想实现这种效果，只能将表格设为 
\`\`\`css
table-layout: fixed
\`\`\`
`
}, {
	date: `2017/9/1`,
	content: `
Edge和IE11还有Safari好像会试图去识别页面上的数字是否像电话号码，
如果像的话会在这些数字下加一个下划线，并使其可点击打开Skype之类的应用拨号(有些邮箱以及地址也同理)，
想禁用这一特性可在HTML中加上
\`\`\`html
<meta
	name="format-detection"
	content="telephone=no,email=no,address=no"
>
\`\`\`
`
}, {
	date: `2017/9/5`,
	content: `
关于
\`\`\`html
<meta http-equiv="X-UA-Compatible" content="IE=edge">
\`\`\`
详情参看[这个回答](https://stackoverflow.com/questions/6771258/what-does-meta-http-equiv-x-ua-compatible-content-ie-edge-do)
`
}, {
	date: `2017/9/8`,
	content: `
通过ES5shim和Babel使用新特性Class时如果类并没有继承却在 \`contructor()\` 中调用了 \`super()\`
会导致在IE8下报错Stackoverflow。谨记如果没有继承关系则不应该调用 \`super()\` 方法
`
}, {
	date: `2017/9/11`,
	content: `
IE8下可采用
\`\`\`css
filter:
progid:DXImageTransform
.Microsoft
.gradient(startColorstr=xxx,endColorstr=xxx);
\`\`\`
来兼容 \`rgba()\`
`
}, {
	date: `2018/6/21`,
	content: `
Andriod中调用WebView来访问H5页面时HTML5的DOMStorage也就是\`localStorage|sessionStorage\`
默认是关闭的，需要通过\`settings.setDomStorageEnabled(true)\`来开启，
未开启的话会碰到在H5中读取localStorage为null的问题
`
}, {
	date: `2018/6/22`,
	content: `
Andriod部分机型的WebView不支持通过
\`\`\`js
window.location.replace()
\`\`\`
来实现无法返回的页面中转操作，
因此建议优先考虑采用History API来实现相应功能
\`\`\`js
window.history.replaceState({}, title, url)
\`\`\`
`
}, {
	date: "2018/6/27",
	content: `
手机端的H5页面长按会弹出复制分享的菜单，如果想要禁用IOS可以通过
\`\`\`css
// 这个属性会导致IOS上的input能唤起浏览器键盘 但无法聚焦input框
// 最终结果就是无法正常输入!!!
// 感觉这种禁用需求应该直接予以否决
user-select: none; 
-webkit-touch-callout: none;
\`\`\`
Andriod通过
\`\`\`js
window.oncontextmenu = e => e.preventDefault()
\`\`\`
`
}, {
	date: "2018/6/28",
	content: `
在联调Andriod WebView内嵌H5页面时发现一个问题，页面的\`font-size|line-height\`会随着系统字体大小的调整而缩放导致布局错位，
比如设置一个div的\`font-size: 14px\`当手机字体设为超小时，
通过Chrome inspect WebView可能会发现Computed Style中显示的实际\`font-size\`为14*0.86=12.04px 
在Andriod端通过\`webview.getSettings().setTextZoom(100)\`可完美解决问题
`
}, {
	date: "2018/7/6",
	content: `
部分Andriod 4.4.4版本的机型WebView不支持CSS3的\`transform\`加了前缀\`-webkit-transform\`也不行
但是手机自带的浏览器应该是支持带前缀的形式的，只是WebView中不支持，
询问Andriod的同学得知WebView采用的浏览器内核和手机自带浏览器的内核还是有差别的
`
}, {
	date: "2018/8/13",
	content: `
在用Vue开发IOS WebView内嵌H5 SPA页面时碰到点击APP返回上一页时出现页面白屏的问题，  
需要滑动一下页面，内容才会显示  
具体问题以及解决方式可以参考[issue](https://github.com/vuejs/vue/issues/5533#issuecomment-343864468)  
导致这个问题的主要原因应该还是在返回时仍去异步加载数据，最佳解决方式应该是缓存相应的异步请求数据
`
}, {
	date: "2018/8/20",
	content: `
在各类Dom事件中可以通过
\`\`\`js
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
\`\`\`
去获取这个事件从触发事件的Dom节点开始到Window的Dom路径
`
}]
