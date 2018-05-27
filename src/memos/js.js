export default [{
	date: "2017/8/2",
	content: "判断一个值是否为 `NaN` 一定要通过 `isNaN()` 而不是通过等号比较，因为 `NaN !== NaN`"
}, {
	date: "2017/8/2",
	content: "在Javascript中进行浮点数运算是不可靠的，遵循IEEE 754标准，二进制的浮点数运算不能正确的处理十进制小数，例如典型的 `0.1 + 0.2 !== 0.3` 在一定的精度范围内可通过将小数转化为整数再进行比较来解决这个问题"
}, {
	date: "2017/8/3",
	content: "通过Javascript `element.scrollTop = value` 或者jQuery `$(dom).scrollTop(value)` 去设置滚动条滚动位置时，注意所选取的元素就是设置了 `overflow-y : scroll` 的元素"
}, {
	date: "2017/8/3",
	content: "在使用Javascript的 `parseInt()` 时，最好显示的指明进制，因为 `parseInt('0x16') = 22` 而你可能期望的结果是 `parseInt('0x16') = 0` 所以显示的指定进制才能做到真正的结果可控 ```parseInt('0x16', 16) = 22  parseInt('0x16', 10) = 0```  "
}, {
	date: "2017/8/7",
	content: "实现类似改变一个DOM元素的滚动条位置但不触发绑定在上面的onscroll函数，或者改变一个input元素的值不触发绑定在上面的onchange函数的一种思路：在改变值之前先将其绑定的事件函数解绑，改变完成后再将原有函数绑定回元素上注意如果值的改变如果是连续的，也就是这个过程会短时间内重复多次执行时，需要将解绑和绑定操作放在延时函数中执行，避免反复多次的绑定事件和解绑事件消耗过多资源，导致浏览器卡顿"
}, {
	date: "2017/8/12",
	content: "判断点击是否在某个DOM外部发生的思路，判断 `event.srcElement(IE) || event.target(FF)` 是否是这个DOM节点本身或者是其子元素,这里要注意在内部元素有特殊定位的情况下可能这个思路会有问题"
}, {
	date: "2017/8/20",
	content: "Javascript中字符串替换API `String.replace(reg, replacement)` 其中的replacement可以是一个回调函数 `(match, $1, $2, offset, string) =>{}` 通过种方法可以实现将被匹配的文本做特殊的转化后再替换的功能，具体参数意义以及接口可见[这篇文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)"
}, {
	date: "2017/9/1",
	content: "用于监听CSS3动画结束的事件 ```webkitAnimationEnd// Chrome Safari  mozAnimationEnd  MSAnimationEnd// IE10  oanimationend// Opera  animationend```"
}, {
	date: "2017/9/3",
	content: "Javascript中的假值(falsy values) ```false  null  undefined  空字符串''  0  NaN``` 其它值都为true"
}, {
	date: "2017/9/8",
	content: "利用原生的JS即可输出格式化后的JSON字符串 `JSON.stringify(value[, replacer[, space]])` 其中space即是缩进数，默认无缩进，最大为10。replacer可以是一个过滤函数，用来筛选或替换最后的输出结果。具体参数意义以及接口可见[这篇文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)"
}, {
	date: "2017/9/27",
	content: "Javascript中的原型是一种动态关系，改变原型的属性会立即对所有该原型链下的对象可见 ```var a = {}  a.test => undefined  Object.prototype.test = 'Hello'  a.test => Hello```"
}, {
	date: "2017/9/27",
	content: "可以使用Object的 `hasOwnProperty()` 方法来检测一个属性是该对象独有还是由原型链继承而来"
}, {
	date: "2017/9/27",
	content: "Javascript中的Array其实是一种类数组的对象，效率比真正的数组要低，所以会有如下一些奇怪的行为 ```var arr = [1,2,3]  arr[0] => 1  arr['0'] => 1  arr.name = 'Hello'  arr.name => 'Hello'  arr[10] = 10  arr[6] => undefined  arr.length = 1  arr => [1]```"
}, {
	date: "2017/9/27",
	content: "在Javascript中尝试去获取对象的某个属性值时，如果该对象没有该属性，则会继续在其原型链上查找直至 `Object.prototype` ,如果都没有找到才会返回 `undefined`"
}, {
	date: "2017/9/27",
	content: "判断是否是数组的方法，IE9+直接用原生的 `Array.isArray()` 如果要向下兼容的话 ```Object.prototype.toString.call(arg) === '[object Array]'``` Ps:jQuery的 `$.isArray()` 亦是采用这种方式"
}, {
	date: "2017/9/28",
	content: "Javascript的 `setTimeout()` 和 `setInterval()` 都可以接受字符串参数，并类似eval()将其执行，不安全并且效率低下，最好不要使用。具体可见[这篇文档](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)"
}]