# 阅读摘要 - YDKJS Scope & Closure

## Lexical Scope & Dynamic Scope
首先引用一下 Wiki 上的定义：
> A fundamental distinction in scoping is what "part of a program" means. In languages with lexical scope (also called static scope), name resolution depends on the location in the source code and the lexical context, which is defined by where the named variable or function is defined. In contrast, in languages with dynamic scope the name resolution depends upon the program state when the name is encountered which is determined by the execution context or calling context.

大部分现代编程语言（JavaScript / Java / C ...）使用的是 Lexical Scope（词法作用域）。  

简单来说 Lexical Scope 中各变量的作用域在你写出源代码时就已经定下来了，而 Dynamic Scope 中的变量只有在运行时才能确定其作用域。  

下面我们换一种方式来解释，如果一个函数中出现自由变量（既不是形参也不是函数内部定义的局部变量）需要从函数定义时的上下文去寻找，那么就是 Lexical Scope，如果是从函数调用时的运行环境去寻找则是 Dynamic Scope。  

Ps: 这里稍微提一下自由变量和约束变量，局部变量和形参被认为是约束变量，其它变量都称为自由变量。  

通过代码来解释的话就是：
```js
var a = 2
function foo () {
  console.log(a)
}

function bar() {
  var a = 3
  /* 如果是 Dynamic Scope 这里应该输出 3 */
  foo() // 因为 JavaScript 是 Lexical Scope 所以这里输出的是 2
}

bar()
```

## LHS & RHS
LHS（Left-Hand-Side）和 RHS（Right-Hand-Side） 是俩种不同的寻找变量的方式，LHS 查找一个变量是为了给其赋值，而 RHS 查找一个变量是为了获取它的值。例如：
```js
var a = 1

a = 3 // 通过 LHS 查询并给变量 a 赋值 3
console.log(a) // 通过 RHS 查询并获得变量 a 当前的存储值 3
```
作者为什么要提出这个概念呢？因为当出现查询失败的情况，在非严格模式下俩种查询的处理方式是不同的。RHS 会抛出 `ReferenceError` 而 LHS 会在全局作用域下新定义该变量并给其赋值，这也是早先 JavaScript 经常被人诟病的一点，例如：
```js
function foo () {
  a = 1
}
foo()
console.log(window.a) // 1

function bar () {
  console.log(b)
}
bar() // Uncaught ReferenceError: b is not defined
```
Ps: 需要注意严格模式(`use strict`)下就不存在这样的问题，所以推荐大家应该坚持使用严格模式。

## with & eval
首先要强调无论任何时刻都不建议使用 `with` 或者 `eval` 虽然它们可以做到绕开 Lexical Scope 的限制，但是 JavaScript Engine 会在编译时做很多优化工作。其中的一个优化便是根据代码定义时的上下文预先确定好可能被使用的变量和函数存放的位置，这样在运行过程中就可以更快的找到这些变量，这些优化显然是以严格遵守 Lexical Scope 为前提的。  

那么如果你在任一代码片段中使用了 `with` 或者 `eval` 会怎么样呢？如果 Lexical Scope 得不到保证，那么引擎以它为前提做的优化就很有可能会导致错误，所以引擎只能放弃对你所有其它代码的优化操作。所以哪怕你只用了一次，也会影响到你整个 App 的性能。  

下面我们来看看它们分别是如何绕开 Lexical Scope 的：
```js
var a = 1
function foo(code) {
  eval(code)
  console.log(a) // 2
}

foo('var a = 2')
```
可以看到，本来根据代码定义时的上下文便可以确定的变量 `a` 的作用域，现在因为 `eval` 的使用变成了只有到运行的那一刻才能确定，因为 `code` 甚至可以是用户输入的任意字符串。  

下面我们来看看 `with`（Ps：严格模式下会被禁用） ：
```js
const o = {
  a: 1
}
// 新产生了一个包含对象 o 属性值的作用域
with (o) {
  a = 2
  b = 3
}
console.log(o) // {a: 2}
/* 意外发生了，由于在对象里没有 b 结果定义了一个全局变量 b */
console.log(b) // 3 
```
除此之外还有 `new Function()` / `setTimeout()` / `setInterval()` 等如果传入字符串也会导致相同的后果。

## Block Scope In try...catch
JavaScript `catch` 块中申明的变量具有块级作用域。
```js
try {
  throw undefined
} catch(a) {// 这里的a具有块级作用域
  a = 1
  console.log(a)
}
console.log(a)// Uncaught ReferenceError: a is not defined
```
事实上我看了下最新的 Babel 以及 Traceur 都不再采用这种方式来兼容块级作用域，可能是出于 `try...catch` 会影响性能的缘故。

## Closure
先给出书中的定义：
> Closure is when a function is able to remember and access its lexical scope even when that function is excuting outside it's lexical scope.

事实上闭包存在于 JavaScript 的各个角落，每当我们把函数当作一等公民在程序中传递使用时我们就可以观察到闭包，包括但不限于提注册事件监听函数 / 设置定时器 / 在 Ajax 中使用回调函数。

关于 Closure 的几个代码片段：
```js
// var let const 不会影响 Closure
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

// Arrow Function 不会影响 Closure
var foo = () => {
	var a = 1
	let b = 2
	const c = 3
	return () => console.log(a, b, c)
}

foo()()

// setTimeout 会创建一个 Closure
function wait(message) {
	setTimeout(() => {
		console.log(message)
	}, 1000)
}

wait('hi')
```
如果你不熟悉闭包的话可能会对下面这个新手经常碰到的问题感到奇怪：
```js
for (var i = 0; i < 10; i++) {
  setTimeout(function() {
    console.log(i)
  })
}
```
让人意外的是最后的输出了 10 个 `10` 而不是按顺序输出 `0~9`，造成这个问题一是因为 `var` 是函数作用域二是因为闭包的存在函数中的 `i` 指向的都是同一个变量。  

在没有 `let` 和块级作用域的时候，我们解决这个问题的办法也是利用闭包，在每次循环中去通过 IIFE 新构造一个函数作用域：
```js
for (var i = 0; i < 10; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j)
    })
  })(i)
}
```