jQuery可以通过 `$(':visible')/$(':hidden')` 来查找可见/不可见的Dom元素
(通过判断元素的height和width是否大于0，所以
```css
opacity:0;
visibility: hidden;
```
的元素会被认为是可见的)。
这俩种选择器会带来性能上的问题，尽量避免使用，
一定要使用的话也应该先通过纯CSS选择器将目标选出再通过 `$(dom).is(':visible')` 或 `$(dom).is(':hidden')` 判断，
或者通过 `$(dom).filter(':visible')` 或 `$(dom).filter(':hidden')` 过滤

---

jQuery核心函数的几种重载形式：
```js
$(($) => {  //文档加载完毕  //相当于$( document ).ready()  })
$('selector') // 选择器
$('selector', parentDom) // 选择器(在父元素的范围下)
$(dom) // 将Dom对象包装成jQuery对象
$(domArray) // 将Dom对象的数组包装成jQuery对象
$() // 1.4以后返回空的jQuery对象
$('<div></div>') // 将Html字符串包装成jQuery对象
$('<div>', {'class': 'a'}) // 生成一个标签并包装成jQuery对象
```

---

关于 `$.trim()` IE9+应该已经实现了原生的 `String.prototype.trim()` 
低版本浏览器可以使用jQuery的方式来实现Polyfill
```js
function( text ) {
	return text == null ?
		''
		:
		( text + '' ).replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '' )
}
```
其正则中的 `\xA0` 代表全角空格 `\uFEFF` 代表BOM头