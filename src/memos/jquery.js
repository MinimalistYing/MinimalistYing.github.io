export default [{
	date: `2017/8/29`,
	content: `
利用好jQuery的事件命名空间可以减少很多需要在一个Dom元素的同一事件上绑定多个不同回调函数时会碰到的问题，例如
\`\`\`js
$(dom).on('click.a', () => {})
$(dom).on('click.b', () => {})
\`\`\`
当出于某种原因需要解绑第一个函数时，只需要\`$(dom).off('.a')\` 即可实现，
同时也不会对b命名空间下的绑定事件有任何影响。如果想触发某个特定空间下的事件，
可以通过 \`$(dom).trigger('click.b')\` 来实现
`
}, {
	date: `2017/8/30`,
	content: `
jQuery可以通过 \`$(':visible')/$(':hidden')\` 来查找可见/不可见的Dom元素
(通过判断元素的height和width是否大于0，所以
\`\`\`css
opacity:0;
visibility: hidden;
\`\`\`
的元素会被认为是可见的)。
这俩种选择器会带来性能上的问题，尽量避免使用，
一定要使用的话也应该先通过纯CSS选择器将目标选出再通过 \`$(dom).is(':visible')\` 或 \`$(dom).is(':hidden')\` 判断，
或者通过 \`$(dom).filter(':visible')\` 或 \`$(dom).filter(':hidden')\` 过滤
`
}, {
	date: `2017/8/30`,
	content: `
jQuery核心函数的几种重载形式：
\`\`\`js
$(($) => {  //文档加载完毕  //相当于$( document ).ready()  })
$('selector') // 选择器
$('selector', parentDom) // 选择器(在父元素的范围下)
$(dom) // 将Dom对象包装成jQuery对象
$(domArray) // 将Dom对象的数组包装成jQuery对象
$() // 1.4以后返回空的jQuery对象
$('<div></div>') // 将Html字符串包装成jQuery对象
$('<div>', {'class': 'a'}) // 生成一个标签并包装成jQuery对象
\`\`\`
`
}, {
	date: `2017/8/30`,
	content: `
使用 \`$(dom).html('...')\` 时需注意防范脚本注入攻击，如果传入的字符串中包含可由用户填写的字段需要先进行转义，
更好的办法是尽量使用 \`$(dom).text('...')\`
`
}, {
	date: `2017/9/26`,
	content: `
jQuery部分版本(1.10.X 1.8.X 可能还有其它)存在一个很奇怪的Bug，
在HTML标签中使用nodeName作为ID(或者input的name)会导致页面报错 \`a.nodeName.toLowerCase is not a function\` 
使用nodeType作为ID会导致$(window)发生变化并且绑定在上面的resize事件会失效。
综上所述，以后谨记不要使用nodeName/nodeType/nodeValue作为HEML标签的ID或者name。
`
}, {
	date: `2017/11/14`,
	content: `
关于 \`$.trim()\` IE9+应该已经实现了原生的 \`String.prototype.trim()\` 
低版本浏览器可以使用jQuery的方式来实现Polyfill
\`\`\`js
function( text ) {
	return text == null ?
		''
		:
		( text + '' ).replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '' )
}
\`\`\`
其正则中的 \`\xA0\` 代表全角空格 \`\uFEFF\` 代表BOM头
`
}]