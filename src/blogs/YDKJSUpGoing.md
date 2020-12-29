# 「YDKJS Up & Going」

## JavaScript 是解释性语言吗
通常来说我们会理所当然的认为它毋庸置疑是解释性语言，因为它不需要在本地编译成字节码才能发布运行，并且最终它都是运行在类似 V8 的引擎之上。  

但是实际上我们运行在浏览器中的 JavaScript 是会被 V8 进行实时编译（JIT）的，所以可以看 MDN 给出的最新定义：

> JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions.

所以说 JavaScript 是解释性语言，因为它的源代码需要在每次运行前被处理，但同时现代浏览器的引擎也会对其进行实时编译来优化性能。  

还可以看看 [这篇文章](https://segmentfault.com/a/1190000013126460)。

## typeof
`typeof` 通常用来判断一个变量当前存储值的类型，它有如下几个可能的返回值：
* number
* string
* boolean
* undefined
* function
* object
* symbol // new in ECMAScript 2015
* bigint // new in ECMAScript 2020

需要注意的是下面这几种类型的值不能通过 `typeof` 来判断：
```js
let variable = null

typeof variable // => object
/* 正解 */ 
variable === null // => true

/* ---------------------- */

variable = []
typeof variable // => object
/* 正解 */ 
Array.isArray(variable) // => true
/* 兼容旧版本，Ps:jQuery的 `$.isArray()` 亦是采用这种方式 */
Object.prototype.toString.apply(variable) === '[object Array]' // => true

/* ---------------------- */

variable = NaN
typeof variable // => number
/* 正解 */ 
Number.isNaN(variable) // => true
/* 兼容旧版本，NaN 是 JavaScript 中唯一不等于自身的值 */
variable !== variable // => true

/* ---------------------- */

variable = /abc/g
typeof variable // => object
/* 正解 */ 
Object.prototype.toString.apply(variable) === '[object RegExp]' // => true
```

## void
`void` 操作符可以简单看作是一个接受任何参数并返回 `undefined` 的函数，例如：
```js
// 所有的结果都是 undefined
void true
void {}
void 123
void 'hello'
```

至于我们经常看到的 `void 0` 是因为在早期的 Javascript (ES5 之前)中 `undefined` 是一个变量，所以可能会在程序执行过程中被修改，为了安全起见才使用 `void 0` 替代 `undefined`。

MDN 定义：
> The `void` operator evaluates the given expression and then returns `undefined`

可以借助 `void` 使函数声明变为可以立即调用的函数表达式：
```js
void function iife() {
  console.log('iife')
}()

typeof iife // => undefined
```

可以用来阻止链接跳转，当然现在不建议这么使用，只是大家在互联网上肯定还是能见到这种写法，能明白为什么就行：
```html
<a href="javascript:void(0);">不会跳转的链接</a>
```

因为简写的箭头函数是会有返回的，如果大家想偷懒写成一行但是不希望有返回可以这么做：
```js
function doSomething () {
  return 'hello'
} 

const funcWithReturn = () => doSomething()
const funcWithoutReturn = () => void doSomething()

console.log(funcWithReturn()) // => hello
console.log(funcWithoutReturn()) // => undefined
```

## Falsy
JavaScript 一共有 `false`/`0`/`""`/`null`/`undefined`/`NaN`/`0n` 这七种假值(Falsy Value)。  

在 `if()` `while()` 等条件判断中，除了这几个值外的值都会被认为是 `true`。

## var
`var` 是 ES6 前声明变量的唯一方式，通常认为它是函数级别作用域，事实上这么说不完全准确，看如下 MDN 给出的定义：
> The scope of a variable declared with var is its current execution context, which is either the enclosing function or, for variables declared outside any function, global.

也就是说只有在函数内部通过 `var` 声明的变量具有函数作用域，否则是全局作用域。  

此外通过 `var` 声明的变量具有变量提升（hoisting）的特性(Ps: 之所以这样其实与 JavaScript 是如何被解释执行的有关)：
```js
(function() {
  console.log(a)
  a = 2
  var a
  console.log(a)
})()

// 因为变量提升，相当于
(function() {
  var a
  console.log(a)
  a = 2
  console.log(a)
})()

// 没有声明变量会直接报错
(function() {
  console.log(a) // Uncaught ReferenceError: a is not defined
  a = 2
})()

// 不声明变量就直接赋值给变量很危险，这样会使 window.a = 2,污染全局作用域
// 可以通过 use strict 使用严格模式来避免这个问题
// 事实上如果你使用 Webpack + Babel 会发现所有函数默认最外层都加上了 use strict
(function() {
  a = 2
})()

(function() {
	'use strict'// 严格模式下不加var声明会直接报错
	a = 2 // Uncaught ReferenceError: b is not defined
})()


(function() {
  var a = b = 1 // var 声明的是a 导致b其实是一个全局变量
})()

console.log(b)// 1
console.log(typeof a)//undefined 注意 如果直接试图使用a变量会抛出错误 但在typeof操作符后就不会
console.log(a)// Uncaught ReferenceError: a is not defined
```
变量提升不是一个值得利用的特性，我们应该在函数的开头声明好所有需要的变量，相反的函数声明的提升是一个更被大家所接受的特性。

## 函数声明（Function Declaration）和函数表达式（Function Expression）
这是函数声明：
```js
function foo() {}
```

这些是函数表达式：
```js
const foo = function () {} // foo.name => 'foo'
const baz = function named () {} // baz.name => 'named'
// 箭头函数都是匿名的函数表达式(function expression)
const bar = () => {} // bar.name => 'bar'
const o = {
  fn: function named() {}
}
```
可以简单通过 `function` 是不是出现在一条语句的最前方来判断函数表达式以及函数声明。  

主要的区别在于函数声明会存在函数提升的情况而函数表达式不会：
```js
// 函数声明会提升 函数表达式不会
(function test() {
   console.log(foo()) // 2
   console.log(bar()) // Uncaught TypeError: bar is not a function
   function foo() { // 函数声明
      return 2
   }
   var bar = function () { // 函数表达式
   		return 2
   }
})()
```

另外，对比下面俩个片段会发现，函数声明的提升在变量提升之前：
```js
var a
function a(){ return 1 }
console.log(a) // ƒ a(){ return 1 }


function a(){ return 1 }
var a // 重复声明，忽略
console.log(a) // ƒ a(){ return 1 }
```

需要特别注意的一点是重复声明变量会被忽略，而重复声明函数会进行覆盖：
```js
function a() {
  console.log(1)
}
function a() {
  console.log(2)
}
var a
a() // 2
```

此外，函数声明不能匿名而函数表达式可以是匿名的，并且哪怕它被命名，它的命名也只在自身的函数作用域内可见：
```js
const baz = function named () {
  typeof named // => function
}

typeof named // => undefined
```

关于函数表达式以及函数声明的更多差别可见 [这篇文章](http://kangax.github.io/nfe/)  

## 其它
> Code without comments is suboptimal.Too many commentsis probably a sign of poorly written code.Comments should explain why,not what.They can optionally explain how if what's written is particularly confusing.


> One of the most important lessons you can learn about writing code is that it's not just for the computer.Code is every bit as much, if not more, for the developers as it is for the compiler.


> Only values have types in JavaScript.


> Rather than thinking of `array` and `function` as built-in types,these should be thought of more like subtypes - specialized versions of the `object` type.