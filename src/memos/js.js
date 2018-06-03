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
}, {
	date: "2017/9/28",
	content: "`Array.prototype.sort()` 可传入比较函数 `comparefn(a, b)` 来排序，希望a排在前该函数需返回一个负数，反之返回正数，俩者相等则返回0。"
}, {
	date: "2017/9/28",
	content: "关于 `String.prototype.split([separator[, limit]])`  ```'abc'.split() => ['abc']  'abc'.split('') => ['a','b','c']  'a,b'.split(/(,)/) => ['a', ',', 'b']  'abc'.split('').reverse().join('')// 字符串倒序```"
}, {
	date: "2017/10/23",
	content: "Javascript的变量名允许使用Unicode字符集中的所有字母和数字，所以类似 `var 变量 = 1` 也是合法的"
}, {
	date: "2017/10/23",
	content: "使用Javascript时如果选择在行尾不加上 `;` 是比较危险的行为，例如 ```var arr = [1,2,3]  var b = arr  [2].toString()  console.info(b)``` 的结果可能会出人意料，自动加分号的结果是 `var arr = [1,2,3];var b = arr[2].toString();console.info(b);` 再第二行以 `( [ + -` 开头时都需要注意避免以上情况"
}, {
	date: "2017/10/23",
	content: "使用 `String.prototype.length()` 来判断字符串长度在某些特殊场景下存在问题，例如 `'𝒜'.length === 2` 因为这个方法判断的是给定字符串用了几个UTF-16（16bit）来编码，而有些特殊字符需要32bit来编码，这时候这个方法计算一个字符的长度是2，判断方法可见[这篇Blog](http://ife.baidu.com/note/detail/id/583)"
}, {
	date: "2017/11/12",
	content: "Javascript的函数表达式 `var f = function (){ return 1 }` 函数声明 `function g(){ return 1 }` 在混合时 `var f = function g(){ return 1 }` 其实也是函数表达式，所以此时的 `g` 在函数外部是不可见的，试图执行 `g()` 会报错，关于函数表达式以及函数声明的具体差别可见[这篇文章](http://kangax.github.io/nfe/) Ps:函数申明会存在函数提升的情况而函数表达式不会"
}, {
	date: "2017/11/21",
	content: "关于 `Date` 对象有几点需要注意 `new Date(year, month[, day[, hour[, minutes[, seconds[, milliseconds]]]]])` 使用这个构造函数时 `month` 参数0代表一月，11代表十二月，同理 `dateObj.getMonth()` 一月返回0，十二月返回11 `dateObj.getDay()` 0代表周日，6代表周一"
}, {
	date: "2017/11/22",
	content: "关于 `typeof` 一共有六种可能结果 `number/string/boolean/undefined/function/object` 其中有一种较怪异的行为需注意 `typeof null // 'object'` "
}, {
	date: "2017/11/23",
	content: "Javascript中的整数在超过9007199254740992也就是 `Math.pow(2, 53)` 时精度无法精确至个位，会出现 `Math.pow(2, 53) + 1 === Math.pow(2, 53)` 的情况，关于其它数字过大时存在的问题可见[这篇Blog](http://www.plqblog.com/views/article.php?id=29)"
}, {
	date: "2017/11/24",
	content: "小技巧，可以通过俩次位运算来将 `string` 形式的数字转为(效率比parseInt等高) `number` 类似 `~~'123'// 123` ,Ps: 处理数字的上限是 `Math.pow(2,31) - 1` 对超出该值的数字无法正确转化"
}, {
	date: "2017/12/29",
	content: "获取浏览器当前滚动条位置可通过 `window.scrollY||window.pageYOffset` 前者不兼容IE,横向位置则通过 `window.scrollX||window.pageXOffset` "
}, {
	date: "2018/1/16",
	content: "通过 `Element.requestFullscreen()` 以及 `Document.exitFullscreen()` 可以将页面上的内容进行全屏展示以及取消全屏展示"
}, {
	date: "2018/2/2",
	content: "在Javascript中 `Object` 是 `truthy value` 所以哪怕是 `new Boolean(false)` 也会在类型转化时被判断为true ```false && console.log(1) => false  new Boolean(false) && console.log(1) => 1 ```"
}, {
	date: "2018/2/2",
	content: "ES6的 `import` 除了通常的 `import xx from 'lib'` 外，还可以采用 `import 'lib'` 将依赖全部引入但不将其赋值给任何变量。在使用webpack引入样式文件时有一些作用，我们可以 `import 'xx.less'` 而不需要繁琐的 `import Style from 'xx.less'`"
}]