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

实现类似改变一个DOM元素的滚动条位置但不触发绑定在上面的onscroll函数  
或者改变一个input元素的值不触发绑定在上面的onchange函数的一种思路：在改变值之前先将其绑定的事件函数解绑  
改变完成后再将原有函数绑定回元素上注意如果值的改变如果是连续的，也就是这个过程会短时间内重复多次执行时  
需要将解绑和绑定操作放在延时函数中执行，避免反复多次的绑定事件和解绑事件消耗过多资源，导致浏览器卡顿

---

Javascript中字符串替换API
```js
const replacement = (match, $1, $2, offset, string) =>{}
// 其中的replacement可以是一个回调函数
String.replace(reg, replacement)
```
通过种方法可以实现将被匹配的文本做特殊的转化后再替换的功能  
具体参数意义以及接口可见[这篇文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)

---

用于监听CSS3动画结束的事件
* webkitAnimationEnd// Chrome Safari
* mozAnimationEnd
* MSAnimationEnd// IE10
* oanimationend// Opera
* animationend

---

利用原生的JS即可输出格式化后的JSON字符串
```js
JSON.stringify(value[, replacer[, space]])
// space即是缩进数，默认无缩进，最大为10
// replacer可以是一个过滤函数，用来筛选或替换最后的输出结果
```
具体参数意义以及接口可见[这篇文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

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

关于
```js
String.prototype.split([separator[, limit]])
// 'abc'.split() => ['abc']
// 'abc'.split('') => ['a','b','c']
// 'a,b'.split(/(,)/) => ['a', ',', 'b']
'abc'.split('').reverse().join('') // 字符串倒序
```

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

Javascript中的整数在超过9007199254740992也就是 `Math.pow(2, 53)` 时精度无法精确至个位  
会出现 `Math.pow(2, 53) + 1 === Math.pow(2, 53)` 的情况  
关于其它数字过大时存在的问题可见[这篇Blog](http://www.plqblog.com/views/article.php?id=29)

---

获取浏览器当前滚动条位置可通过 `window.scrollY(Chrome Safari FF)||window.pageYOffset(IE9+)`   
横向位置则通过 `window.scrollX||window.pageXOffset`

---

通过 `Element.requestFullscreen()` 以及 `Document.exitFullscreen()`   
可以将页面上的内容进行全屏展示以及取消全屏展示

---

在Javascript中 `Object` 是 `truthy value`,所以哪怕是 `new Boolean(false)` 也会在类型转化时被判断为true
```js
false && console.log(1) // false
new Boolean(false) && console.log(1) // 1
```
这里的关键其实不在于布尔值的判断，而是通过构造函数和直接使用字面量来初始化基本类型的区别。  

例如比较如下三种生成字符串的方式：
```js
const str1 = new String('a')
const str2 = 'a'
const str3 = String('a')

// 所以 'a' 和 String('a') 是一样的
str1 === str2 // false
str1 === str3 // false
str2 === str3 // true

// 可以看到这就是最主要的区别，以及后续差异的根本原因
typeof str1 // object
typeof str2 // string

str1.foo = 'foo'
str2.foo = 'foo'
console.log(str1.foo) // foo
console.log(str2.foo) // undefined
```

---

关于`encodeURI|decodeURI`以及`encodeURIComponent|decodeURIComponent`，俩者都是用于对URI进行编解码操作  
区别在于前者默认接受的是一个完整的URL所以不会对所有的字符进行编解码  
而后者会对所有需要被编解码的字符进行编解码，例如对`http://www.a.com?a=1+1`进行`encodeURI`  
不会发生任何变化而进行`encodeURIComponent`的结果是`http%3A%2F%2Fwww.a.com%3Fa%3D1%2B1`

---

关于 `location.href = 'xx' || location.assign('xx')` 与 `location.replace('xx')` 
俩者的区别在于采用前者当前的地址会被计入History中而后者不会，所以通过后者跳转到新页面后无法通过后退返回，
这点在实现某些中间页面跳转页面是会很有用

---

在使用ES6的Default Parameter时需要注意  
调用函数时如果希望传入空参数应该传 `undefined` 而不是 `null`  
例如 `foo(undefined, 66)`

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

关于ES6 Module
* 基于文件，每个文件为一个Module，不可能一个文件中包含多个Module
* 静态，不能动态的去修改一个Module对外export的API
* 单例，所有的import都是指向同一实例
* import和export只能出现在一个Module的最顶层，也就是说不能出现在任何块中或函数中

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

IE10+ 以及各现代浏览器提供了原生的方法 `btoa` 以及 `atob` 支持对字符串进行 Base64 编解码  
```js
// Binary to ASCII 编码
window.btoa('a') // "YQ=="
// ASCII to Binary 解码
window.atob('YQ==') // "a"
```
需要注意的是这俩个方法只支持 `ASCII` 编码，所以在处理 `UTF-8` 编码的字符串时会出现乱码  
例如 `btoa('我')` 会报错
> Uncaught DOMException: Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.

解决方法如下(Ps: GitHub 提供部分 API 就是通过这种形式对内容编解码的)
```js
// 编码
window.btoa(unescape(encodeURIComponent(str)))
// 解码
decodeURIComponent(escape(window.atob(str)))
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

利用解构实现交换俩个变量的值，优点是无需中间变量
```js
let x = 1, y = 2
;[ y, x ] = [ x, y ];
console.log(x, y) // 2 1
```
交换数组中不同下标的俩个值
```js
let arr = [1, 2, 3]
// 使用这种方法时最好在前面加上分号 如果你的代码风格是末尾不加分号的话
// 不然有可能会碰到被上一行接着执行的问题
;[arr[2], arr[1]] = [arr[1], arr[2]]
console.log(arr) // [1, 3, 2]
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

---

最新的 ES 提案在 `Class` 内可以通过 `#` 申明私有属性
```js
class Foo {
	#foo = 5
	#bar = 6
	test() {
		console.log(this.#foo, this.#bar)
	}
}
```

---

给定一组数 `1 2 3 4 5 6 7 8 9` 在其间隔处任意加上 `+ - * / 空白` 五种操作符  
列出其所有计算结果为 `100` 的组合
```js
const num = [2, 3, 4, 5, 6, 7, 8, 9]
const operators = ['', '+', '-' , '*', '/']

function recursive(t, i) {
	let str
	for (let operator of operators) {
		str = t + operator + num[i]
		if (i >= 7) {
			if (eval(str) === 100) console.log(str, eval(str))
		} else {
			recursive(str, i+1)
		}
	}
}

// 以 1 为起始进行递归
recursive('1', 0)

```

---

关于 JavaScript 中的 Timer `setTimeout` 以及 `setInterval`
* 每次调用会返回一个自增的 ID 用于传入 `clearTimeout` 以及`clearInterval` 来清除计时器
* 由于 JavacScript 是单线程的，所以这俩个函数并不能确保一定会在指定时间到达后立即执行  

```js
// 超出 100ms 一段时间后才会输出
// 因为线程被循环阻塞
console.time('执行间隔')
setTimeout(() => console.timeEnd('执行间隔'), 100)

for (let i=0; i<1000000000; i++){}
```
* 不传入延时参数时默认为 0ms，哪怕延时 0ms 也是异步，只有主线程空闲时才执行

```js
// 输出顺序为 2 1
// 并不会按正常执行顺序输出
setTimeout(() => console.log(1))

console.log(2)
```
* `setInterval` 所指的间隔并不是指多长时间执行一次，而是多长时间将该函数放到执行队列中一次  
所以当传入其中的函数执行时间超过所设的间隔时间时，函数真实的执行间隔可能为 0ms

```js
let i = 0;
const start = Date.now();
const timer = setInterval(() => {
    i++;
    i === 5 && clearInterval(timer);
    console.log(`第${i}次开始`, Date.now() - start);
    for(let i = 0; i < 100000000; i++) {}
    console.log(`第${i}次结束`, Date.now() - start);
}, 100);
```

Ps: 还有一个 IE 专属的 `setImmediate` 可以理解为 `setTimeout(0)` 的替代，在此不做展开

---

项目中开发接入支付宝跳转流程时碰到了一个问题  
需要通过 Ajax 向后台请求跳转 URL 并通过 `window.open()` 在新窗口中打开  
由于浏览器限制只允许在 Dom 事件处理函数中通过 `window.open()` 来打开新页面  
所以如果直接在请求成功的回调函数中进行操作会发现打开新窗口的操作被浏览器拦截  
需要用户确认允许该页面弹窗才能正常跳转  
该问题的最终解决方案如下
```js
function onClick() {
	// 先在点击事件中打开原项目的中转页
	const newWindow = window.open('redirect.html', '_blank')
	axios.post('xxx')
	.then(url => newWindow.location.href = url) // 请求成功 将新页面的地址修改为后台返回的 URL
	.catch(err => newWindow.close()) // 请求失败 关闭新开的窗口
}
```

---

如何判断一个函数是正常被调用还是通过 `new` 当作构造函数调用
```js
function Foo() {
	// 严格模式下 this 为 undefined
	if (this === window || typeof this === undefined) {
		console.log('普通调用')
	}
	
	// 构造函数中的 this 指向新创建的实例
	if (this instanceof Foo) {
		console.log('构造函数调用')
	}	
}
```

---

```js
// 因为都是构造函数？
typepf Object // => function
typeof Array // => function
typeof Symbol // => function
```

---

判断一个变量是否为数字
```js
// 排除 NaN +Infinity -Infinity
function isNumber(a) {
	return typeof a === 'number' && Number.isFinite(a)
}
```

---

使用 Fetch API 可以通过 `res.ok === true` 来判断请求是否成功  
相当于 `res.status >= 200 && res.status < 300`

---

关于在 Promise 中使用 `return Promise.reject()` 以及 `return new Error()` 的不同
```js
Promise.resolve('a')
.then(res => {
  if (Math.random() > 0.5) {
    return res
  } else {
    return Promise.reject('error')
    // return new Error('error')
  }
}, err => {
  console.error(err + '1 reject')
}).then(res => {
	// 使用 return new Error() 会执行
  console.log(res + '2 fulfill')
}, err => {
	// 使用 return Promise.reject() 会执行
  console.error(err + '2 reject')
})
```

---

```js
const listeners = []
listeners.push(function() {
  console.log(this)
})
listeners.push(function() {
  console.log(this)
})

for (let i = 0; i < listeners.length; i++) {
	const listener = listeners[i]
	listener() // 指向 window
}

for (let i = 0; i < listeners.length; i++) {
	listeners[i]() // 指向 listeners 数组
}

for (let listener of listeners) {
	listener() // 指向 window
}
```
理解这个问题关键在于认识到数组在 Javascript 中其实只是一种特殊的对象

---

Iframe 内嵌的子页面与父页面间可以通过 postMessage 来相互通信
```js
// 子页面发送
window.parent.postMessage('你好 爸爸', '*')
// 父页面发送
document.getElementsByTagName("iframe")[0].contentWindow.postMessage('你好 儿子', '*')
// 接受页面
window.addEventListener('message', e => console.log(e))
```
有安全方面顾虑的话最好把 * 改为特定的域名

---

在试图通过数组的 `forEach` `map` 等方法对数组内部存储对值进行修改时需要注意
```js
const a = {val: 1}
const b = {val: 2}
const c = {val: 3}
const arr = [a, b, c]
arr.forEach(o => o.val = 0)
console.log(arr) // [{val: 0}, {val: 0}, {val: 0}]
``` 
以上这种修改方式是正确的，因为 `o` 是作为一个临时变量指向的是每次循环过程中的对象  
但是下面这种修改方式就是错误的，因为我们只不过是把临时变量 `num` 重新赋值了一次而已，并不会对数组本来的数据造成影响
```js
const arr = [1, 2, 3]
arr.forEach(num => num = 0)
console.log(arr) // [0, 0 ,0]
```
