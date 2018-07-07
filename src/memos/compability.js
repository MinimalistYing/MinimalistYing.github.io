export default [{
	date: `2017/8/1`,
	content: `
为了使 \`display: inline-block\` 在IE8中起作用，必须在文档开头加上 \`<!DOCTYPE html>\` 并在头部加上 \`<meta http-equiv='X-UA-Compatible' content='IE=edge'>`
}, {
	date: `2017/8/2`,
	content: `
IE8中的伪元素只支持类似 \`:after\` 的写法，不支持 \`::after\` 的写法`
}, {
	date: `2017/8/9`,
	content: `
IE8切换为兼容性视图模式时会将原User-Agent中包含的 \`MSIE8.0\` 转变为 \`MSIE7.0\` 所以在通过UA来判断IE版本时尤其要注意`
}, {
	date: `2017/8/13`,
	content: `
可以通过 \`filter : Alpha(opacity = ?)\` 来在IE7-8中兼容CSS3的 \`opacity\` 属性`
}, {
	date: `2017/8/16`,
	content: `
在IE8下如果在 \`table-layout : auto\` 的表格中为单元格设置
\`\`\`css
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
\`\`\`
想实现单元格内文字过长时出现...并截断多余内容会发现无效，反而表格会被内容撑宽，破坏原有布局。
要想实现这种效果，只能将表格设为 
\`table-layout : fixed\``
}, {
	date: `2017/9/1`,
	content: `Edge和IE11还有Safari好像会试图去识别页面上的数字是否像电话号码，如果像的话会在这些数字下加一个下划线，并使其可点击打开Skype之类的应用拨号(有些邮箱以及地址也同理)，想禁用这一特性可在HTML中加上 \`\`\`<meta name='format-detection' content='telephone=no,email=no,address=no'>\`\`\``
}, {
	date: `2017/9/5`,
	content: `关于 \`<meta http-equiv='X-UA-Compatible' content='IE=edge'>\`
	详情参看[这个回答](https://stackoverflow.com/questions/6771258/what-does-meta-http-equiv-x-ua-compatible-content-ie-edge-do)`
}, {
	date: `2017/9/8`,
	content: `通过ES5shim和Babel使用新特性Class时如果类并没有继承却在 \`contructor()\` 中调用了 \`super()\` 会导致在IE8下报错Stackoverflow。谨记如果没有继承关系则不应该调用 \`super()\` 方法`
}, {
	date: `2017/9/11`,
	content: `IE8下可采用 \`filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=xxx,endColorstr=xxx);\` 来兼容 \`rgba()\``
}, {
	date: `2018/6/21`,
	content: `Andriod中调用WebView来访问H5页面时HTML5的DOMStorage也就是\`localStorage|sessionStorage\`默认是关闭的，需要通过\`settings.setDomStorageEnabled(true)\`来开启，未开启的话会碰到在H5中读取localStorage为null的问题`
}, {
	date: `2018/6/22`,
	content: `Andriod部分机型的WebView不支持通过\`window.location.replace()\`来实现无法返回的页面中转操作，因此建议优先考虑采用History API来实现相应功能\`window.history.replaceState({}, title, url)\``
}]
