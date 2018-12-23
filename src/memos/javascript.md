判断一个值是否为 `NaN` 一定要通过 `isNaN()` 而不是通过等号比较，因为 `NaN !== NaN`

---

在Javascript中进行浮点数运算是不可靠的，遵循IEEE 754标准，二进制的浮点数运算不能正确的处理十进制小数，
例如典型的 `0.1 + 0.2 !== 0.3` 在一定的精度范围内可通过将小数转化为整数再进行比较来解决这个问题

---

通过Javascript
```js
element.scrollTop = value
$(dom).scrollTop(value)
```
去设置滚动条滚动位置时，注意所选取的元素就是设置了
```css
overflow-y: scroll
```
的元素

---

在使用Javascript的 `parseInt()` 时，最好显示的指明进制，因为 `parseInt('0x16') === 22` 
而你可能期望的结果是 `parseInt('0x16') === 0` 所以显示的指定进制才能做到真正的结果可控 
```js
parseInt('0x16', 16) === 22
parseInt('0x16', 10) === 0
```

---

实现类似改变一个DOM元素的滚动条位置但不触发绑定在上面的onscroll函数，
或者改变一个input元素的值不触发绑定在上面的onchange函数的一种思路：在改变值之前先将其绑定的事件函数解绑，
改变完成后再将原有函数绑定回元素上注意如果值的改变如果是连续的，也就是这个过程会短时间内重复多次执行时，
需要将解绑和绑定操作放在延时函数中执行，避免反复多次的绑定事件和解绑事件消耗过多资源，导致浏览器卡顿

---

判断点击是否在某个DOM外部发生的思路，判断 `event.srcElement(IE) || event.target(FF)` 
是否是这个DOM节点本身或者是其子元素,这里要注意在内部元素有特殊定位的情况下可能这个思路会有问题

---

Javascript中字符串替换API
```js
const replacement = (match, $1, $2, offset, string) =>{}
// 其中的replacement可以是一个回调函数
String.replace(reg, replacement)
```
通过种方法可以实现将被匹配的文本做特殊的转化后再替换的功能，
具体参数意义以及接口可见[这篇文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)

---

用于监听CSS3动画结束的事件
* webkitAnimationEnd// Chrome Safari
* mozAnimationEnd
* MSAnimationEnd// IE10
* oanimationend// Opera
* animationend

---

Javascript中的假值(falsy values)
* false
* null
* undefined
* 空字符串''
* 0
* NaN

其它值都为true

---

利用原生的JS即可输出格式化后的JSON字符串
```js
JSON.stringify(value[, replacer[, space]])
// space即是缩进数，默认无缩进，最大为10
// replacer可以是一个过滤函数，用来筛选或替换最后的输出结果
```
具体参数意义以及接口可见[这篇文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

---

Javascript中的原型是一种动态关系，改变原型的属性会立即对所有该原型链下的对象可见
```js
var a = {}
// a.test => undefined
Object.prototype.test = 'Hello'
// a.test => Hello
```

---

可以使用Object的 `hasOwnProperty()` 方法来检测一个属性是该对象独有还是由原型链继承而来

---

Javascript中的Array其实是一种类数组的对象，效率比真正的数组要低，所以会有如下一些奇怪的行为
```js
var arr = [1,2,3]
// arr[0] => 1
// arr['0'] => 1
arr.name = 'Hello'
// arr.name => 'Hello'
arr[10] = 10
// arr[6] => undefined
arr.length = 1
// arr => [1]
```

---

在Javascript中尝试去获取对象的某个属性值时，如果该对象没有该属性，
则会继续在其原型链上查找直至 `Object.prototype` ,如果都没有找到才会返回 `undefined`

---

判断是否是数组的方法，IE9+直接用原生的 `Array.isArray()` 如果要向下兼容的话
```js
Object.prototype.toString.call(arg) === '[object Array]'
```
Ps:jQuery的 `$.isArray()` 亦是采用这种方式

---

Javascript的 `setTimeout()` 和 `setInterval()` 都可以接受字符串参数，并类似eval()将其执行，
不安全并且效率低下，最好不要使用。
具体可见[这篇文档](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)

---

`Array.prototype.sort()` 可传入比较函数 `comparefn(a, b)` 来排序，希望a排在前该函数需返回一个负数，
反之返回正数，俩者相等则返回0。

---

关于
```js
String.prototype.split([separator[, limit]])
// 'abc'.split() => ['abc']
// 'abc'.split('') => ['a','b','c']
// 'a,b'.split(/(,)/) => ['a', ',', 'b']
'abc'.split('').reverse().join('') // 字符串倒序
```

---

Javascript的变量名允许使用Unicode字符集中的所有字母和数字，所以类似 `var 变量 = 1` 也是合法的

---

使用Javascript时如果选择在行尾不加上 `;` 是比较危险的行为，例如
```js
var arr = [1,2,3]
var b = arr
[2].toString()
console.info(b)
```
的结果可能会出人意料，自动加分号的结果是
```js
var arr = [1,2,3];
var b = arr[2].toString();
console.info(b);
```
再第二行以 `( [ + -` 开头时都需要注意避免以上情况

---

使用 `String.prototype.length()` 来判断字符串长度在某些特殊场景下存在问题，例如 `'𝒜'.length === 2` 
因为这个方法判断的是给定字符串用了几个UTF-16（16bit）来编码，而有些特殊字符需要32bit来编码，
这时候这个方法计算一个字符的长度是2，判断方法可见[这篇Blog](http://ife.baidu.com/note/detail/id/583)

---

```js
//  函数表达式
var f = function (){ return 1 }
// 函数表达式
var f = function g(){ return 1 }
// 函数声明
function g(){ return 1 }
```
在混合时其实也是函数表达式，所以此时的 `g` 在函数外部是不可见的，试图执行 `g()` 会报错，
关于函数表达式以及函数声明的具体差别可见[这篇文章](http://kangax.github.io/nfe/) 
Ps:函数申明会存在函数提升的情况而函数表达式不会

---

关于 `Date` 对象有几点需要注意 `new Date(year, month[, day[, hour[, minutes[, seconds[, milliseconds]]]]])`
使用这个构造函数时 `month` 参数0代表一月，11代表十二月，
同理 `dateObj.getMonth()` 一月返回0，十二月返回11`dateObj.getDay()` 0代表周日，6代表周一`
}, {
	date: `2017/11/22`,
	content: `
关于 `typeof` 一共有六种可能结果
* number
* string
* boolean
* undefined
* function
* object
* symbol // ES6新增

其中有一种较怪异的行为需注意`typeof null // 'object'`

---

Javascript中的整数在超过9007199254740992也就是 `Math.pow(2, 53)` 时精度无法精确至个位，
会出现 `Math.pow(2, 53) + 1 === Math.pow(2, 53)` 的情况，
关于其它数字过大时存在的问题可见[这篇Blog](http://www.plqblog.com/views/article.php?id=29)

---

小技巧，可以通过俩次位运算来将 `string` 形式的数字转为(效率比parseInt等高) `number` 
类似 `~~'123'// 123` ,Ps: 处理数字的上限是 `Math.pow(2,31) - 1` 对超出该值的数字无法正确转化

---

获取浏览器当前滚动条位置可通过 `window.scrollY(Chrome Safari FF)||window.pageYOffset(IE9+)` ,
横向位置则通过 `window.scrollX||window.pageXOffset`

---

通过 `Element.requestFullscreen()` 以及 `Document.exitFullscreen()` 
可以将页面上的内容进行全屏展示以及取消全屏展示

---

在Javascript中 `Object` 是 `truthy value` 所以哪怕是 `new Boolean(false)` 
也会在类型转化时被判断为true
```js
false && console.log(1) // false
new Boolean(false) && console.log(1) // 1
```

---

ES6的 `import` 除了通常的 `import xx from 'lib'` 外，还可以采用 `import 'lib'` 
将依赖全部引入但不将其赋值给任何变量。在使用webpack引入样式文件时有一些作用，
我们可以 `import 'xx.less'` 而不需要繁琐的 `import Style from 'xx.less'`

---

关于`encodeURI|decodeURI`以及`encodeURIComponent|decodeURIComponent`，俩者都是用于对URI进行编解码操作，
区别在于前者默认接受的是一个完整的URL所以不会对所有的字符进行编解码，
而后者会对所有需要被编解码的字符进行编解码，例如对`http://www.a.com?a=1+1`进行`encodeURI`
不会发生任何变化而进行`encodeURIComponent`的结果是`http%3A%2F%2Fwww.a.com%3Fa%3D1%2B1`

---

关于 `location.href = 'xx' || location.assign('xx')` 与 `location.replace('xx')` 
俩者的区别在于采用前者当前的地址会被计入History中而后者不会，所以通过后者跳转到新页面后无法通过后退返回，
这点在实现某些中间页面跳转页面是会很有用

---

在使用ES6的Default Parameter时需要注意，调用函数时如果希望传入空参数应该传`undefined`而不是`null`
例如`foo(undefined, 66)`

---

返回一个只能执行一次的函数
```js
function once(fn) {
	let isCalled = false
	return () => {
		if (!isCalled) {
			isCalled = true
			fn.apply(this, arguments)
		}
	}
```

---

在使用ES6的Concise Methods时要注意
```js
const o = {
	f() {
		// ....
		f() // Error: f is not a function
	}
}
```
其实等同于
```js
const o = {
	f: function() {
		// ...
		f() // Error: f is not a function
	}
}
```
所以如果想要在函数`f()`通过`f()`来递归调用函数会导致报错，因为`f()`其实是一个匿名函数

---

关于ES6的Object super关键字
```js
const o1 = {
	foo() { console.log(1) }
}
const o2 = {
	foo() {
		// 只能在Object concise methods 中使用
		// 且只能以super.XXX这种形式调用
		super.foo()
		console.log(2)
	}
}
Object.setPrototypeOf(o2, o1)
o2.foo() // 1 2
```

---

箭头函数都是匿名的函数表达式(function expression)

---

关于ES6 Module
* 基于文件，每个文件为一个Module，不可能一个文件中包含多个Module
* 静态，不能动态的去修改一个Module对外export的API
* 单例，所有的import都是指向同一实例
* import和export只能出现在一个Module的最顶层，也就是说不能出现在任何块中或函数中

---

对比`let o1 = {}`以及`let o2 = Object.create(null)`可以发现
在o2并没有从Object.prototype上继承任何属性`o2.__proto__ === undefined`，是一个干净的空对象
通过`{}`创建对象等同于`Object.create(Object.prototype)`

---

ES7移入了新的指数计算操作符`**`  
可以用于替代以往使用的`Math.pow()`  
```js
Math.pow(2, 3) // 4
2 ** 3 //8
```

---

可以借助`\`来实现跨行书写单行字符串  
ES6的Template String也支持这种写法
```js
const str = 'a\
b\
c'

console.log(str) // => 'abc'
```

---

在WebView中动态设置title
```js
setTimeout(() => {
	// 利用iframe的onload事件刷新页面
	document.title = 'xxxxxxxx'
	const iframe = document.createElement('iframe')
	iframe.style.visibility = 'hidden'
	iframe.style.width = '1px'
	iframe.style.height = '1px'
	iframe.onload = () => {
		setTimeout(() => {
			document.body.removeChild(iframe)
		}, 0)
	}
	document.body.appendChild(iframe)
}, 0)
```

---

关于`Object.keys()`以及`Object.getOwnPropertyNames()`的区别  
相同的是俩者都不会列出从原型上继承的属性key值  
区别在于前者只会列出所有可枚举属性的key值，而后者会列出所有属性的key值，包括不可枚举的  
所谓不可枚举的属性，即是通过类似  
`Object.defineProperty(o, 'a', { enumerable: false, value: 0 })`定义的属性

---

Javascript 中一共有六种种原始类型(primitive type)  
string/boolean/number/null/undefined/symbol(ES6 新增)

---

严格模式下函数中的`arguments`会被禁用

---

IE10+ 以及各现代浏览器提供了原生的方法 `btoa` 以及 `atob` 支持对字符串进行 Base64 编解码  
```js
// Binary to ASCII 编码
window.btoa('a') // "YQ=="
// ASCII to Binary 解码
window.atob('YQ==') // "a"
```

---

Javascript `catch` 块中申明的变量具有块级作用域（小技巧 应该不会用到）
```js
try {
	throw undefined
} catch(a) {// 这里的a具有块级作用域
	a = 1
  console.log(a)
}
console.log(a)// Uncaught ReferenceError: a is not defined
```

---

关于 Closure 的几个代码片段

```js
// var let const 不会影响Closure
function foo() {
	var a = 1
	let b = 2
	const c = 3
	function bar() {
		console.log(a, b, c)
	}
  
	return bar
}

foo()()

// Arrow Function不会影响Closure
var foo = () => {
	var a = 1
	let b = 2
	const c = 3
	return () => console.log(a, b, c)
}

foo()()

// setTimeout会创建一个Closure
function wait(message) {
	setTimeout(() => {
		console.log(message)
	}, 1000)
}

wait('hi')
```

---

在条件语句中申明函数会出现的情况

```js
// 不建议使用这种形式
// 估计许多语法校验工具会视这种写法为错误写法

// 按照ES6的  Block-Scoped Function
// 理论上调用a()和b()时应该报错
if (true) {
	function a(){
		console.log('1')
	}
} else {
	function a(){
		console.log('2')
	}
} 
a() // 1

if (false) {
	function b(){
		console.log('1')
	}
} else {
	function b(){
		console.log('2')
	}
} 
b() // 2
```

---

一种特殊的数组去重方法，不考虑兼容性的话最好直接使用 `Array.from(new Set(originArr))` 

```js
// 该方法有个缺陷
// 不能兼容一些特殊情况 因为JSON.stringify()方法有一些特例
function unique(arr) {
	let obj = {}
  
  arr.map(item => {
  	let key = JSON.stringify(item) + typeof item // 避免基本类型 类似 1与'1' stringify后作为key相同
    
    obj[key] = item// 利用JS对象的key不能重复的特性
  })
  
  console.log(Object.values(obj))// 打印结果数组
}
// 注意以下特例
unique([undefined,'undefined',null,'null',NaN,'NaN',Infinity,'Infinity',-Infinity,'-Infinity'])
// 无法进行深度比较 也就无法区分 [1,2,3] 和 [1,2,3] 类似这样的引用类型
function uniqueBySet(arr) {
	console.log(Array.from(new Set(arr)))
}

let test1 = [1,'1',1,true,true,'true']
unique(test1)
uniqueBySet(test1)
let test2 = [[1,2,3], [1,2,3], {a : 1}, {a : '1'}, {b : 1}, {b : 1}]
unique(test2)
uniqueBySet(test2)
let test3 = [undefined, 'undefined', undefined, null, 'null']
unique(test3)
uniqueBySet(test3)
let a = {a : 1}
let test4 = [a , a,  {a:1}]
unique(test4)
uniqueBySet(test4)
```

---

一些有关 Javascript 变量提升的实例

```js
(function() {
  var a = b = 1;// var 声明的是a 导致b其实是一个全局变量
})();

console.log(b)// 1
console.log(typeof a)//undefined 注意 如果直接试图使用a变量会抛出错误 但在typeof操作符后就不会
console.log(a)// Uncaught ReferenceError: a is not defined


(function() {
	'use strict'// 严格模式下不加var声明会直接报错
	var a = b = 1;// Uncaught ReferenceError: b is not defined
})();


// 函数声明会提升 函数表达式不会
(function test() {
   console.log(a);// undefined
   console.log(foo());// 2
   console.log(bar());// Uncaught TypeError: bar is not a function
   var a = 1;
   function foo() {// 函数声明
      return 2;
   }
   var bar = function () {// 函数表达式
   		return 2;
   }
})()


/*
相当于
var a
function a(){ return 1 }
a=123
console.log(a)
*/
var a=123;
function a(){ return 1 }
console.log(a);//123 


/*
相当于
var a
function a(){ return 1 }
a()
*/
function a(){ return 1 }
var a;
a();// 1

/**
const和let不会申明提升？
*/
typeof a; var a=1;
typeof a; const a=1; //Uncaught ReferenceError: a is not defined
typeof a; let a=1; //Uncaught ReferenceError: a is not defined


```

---

利用解构实现交换俩个变量的值，并且无需中间变量
```js
var x = 1, y = 2;
[ y, x ] = [ x, y ];
```

---

利用Function.prototype更快捷的创建一个空函数

```js
var cb = Function.prototype; // 相当于 var cb = function(){}
```

---

关于函数参数同时采用解构以及默认参数时的细微不同

```js
function test( { x = 1 } = {}, { y } = { y: 1 }) {
	console.log(x,y)
}
test() // 1,1
test({}, {}) // 1,undefined
```

---

在 ES6 的对象方法中使用 `super` 
```js
// 注意只能在采用简写的函数中使用且只能用super,xx()的形式不能用super()的形式
var parent = {
	foo() {
  	console.log('parent')
  }
}

var son = {
	foo() {
  	super.foo()
    console.log('son')
  }
}

Object.setPrototypeOf(son, parent)
son.foo() // parent son
```

---

JavaScript 实现大数相加
```js
/**
*	在JS中超出Math.pow(2,53) 也就是 9007199254740992 的整数会失去精度
* 	包括通过parseInt()无法正确转化 在console中无法直接输出等 只能通过字符串的形式进行操作或传输
**/
// 入参 字符串形式的大数a和b
function sum(a, b) {
	a = a.split('')
  b = b.split('')
  let c = 0
  let result = ''
  while (a.length || b.length || c > 0) {
  	c += ~~a.pop() + ~~b.pop() //各位对应相加 结果可能是0~18
    result = c%10 + result
    c = c>9 ? ~~(c/10) : 0 // 处理可能的进位
  }
  
  return result.replace(/^0+/,'') // 处理以0开头的数字
}

console.log(sum('9007199254740992', '1007199254740992'))
```

---

关于 ES6 新引入的 Regexp Sticky Mode (适用于匹配一串以一定规则重复的字符串)
```js
var reg = /foo/
var regSticky = /foo/y
var str = '***foo***'

reg.test(str) // true
reg.lastIndex = 4
reg.test(str) // true

regSticky.test(str) // false
regSticky.lastIndex = 3 // 只有在lastIndex处完全匹配 才算做匹配成功
regSticky.test(str) // true
console.log(regSticky.lastIndex) // 6 匹配成功会将lastIndex移动至匹配结果后紧接着的index
regSticky.test(str) // false
console.log(regSticky.lastIndex) // 0 匹配失败会将lastIndex重置为0
```

---

Iterator 实现斐波那契数列
```js
const febonacci = {
	[Symbol.iterator]() {
  	let a = 1
    let b = 1
    return {
    	next() {
      	const value = b
        let done = b >= 1000 // 超过1000结束迭代
        b = a
        a = value + a       
        
        return {
        	value,
          done
        }
      },
      return() {
      	console.log('Stop iterate')
      	return { done: true }
      }
    }
  }
}

for (let i of febonacci) {
	console.log(i)
  if (i > 500) {
  	break;
  }
}
```

---

JavaScript 实现数组乱序
```js
const arr = [1,2,3,4,5,6,7,8,9,10]

// 错误的方法 以下代码并不能做到真正乱序
// 由于Array.sort()内部的实现方式导致
// Array.prototype.sort(comparefn)
// Calling comparefn(a,b) always returns the same value v when given a specific pair of values a and b as its two arguments.
arr.sort(() => Math.random() - 0.5)

// 进阶班 保证对于相同的a,b arr.sort()比较产生的结果相同
const random = arr.map(Math.random);
arr.sort((a, b) => random[a] - random[b]);

// Fisher–Yates shuffle
let i = arr.length
while(i) {
	const random = Math.floor(Math.random()*i);
  i--;
  [arr[i], arr[random]] = [arr[random], arr[i]]
}
```