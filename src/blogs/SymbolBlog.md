# Symbols in ES6
`Symbol`是 ES6 (时隔多年) 新增的一种 **primitive type** ，可以把它看做一种自动生成 **唯一值** 的机制，它的真实值在代码中无法直接获得，主要用来作为对象的属性避免可能会发生的命名冲突。

## 如何生成 Symbol
```js
// 最基础的方式
const a = Symbol()

// 可以传入一串描述该 Symbol 用途的字符串作为参数
const b = Symbol('some description text')

// 从全局的 Symbol 库中查询所需的结果
// 如果未找到则新建一个并返回
// 这种方式较以上直接构造 Symbol 的优点在于
// 可以不必在外部作用域中专门维护一个变量用于存储生成的 Symbol
const c = Symbol.for('my Symbol')

// 由于 Symbol 全局存在
// 为了尽量避免命名冲突 可以在描述中添加前缀
const d = Symbol.for('prefix.Symbol')
```

## 如何判断一个值是否为 Symbol
```js
// 注意 new Symbol() 会报错 Uncaught TypeError: Symbol is not a constructor
const sym = Symbol()
// 推荐方式
typeof sym === 'symbol'// true

// 并不是一种类与实例化对象的关系 无法通过以下方法判断
sym instanceof Symbol // false
```

## 如何获取 Symbol 的描述
```js
const a = Symbol('desc a')
const b = Symbol.for('desc b')

a.description // desc a
b.description // desc b

Symbol.keyFor(a) // undefined
Symbol.keyFor(b) // desc b

a.toString() // Symbol(desc a)
b.toString() // Symbol(desc b)
```
~~通过上述对比，个人感觉用 `Symbol.for()` 来生成 `Symbol` 好像更加合适，不仅可以少声明一个变量，并且能更方便的获得其描述。~~  

`Symbol.for()` 会从某种程度上破坏 `Symbol` 的唯一特性，所以上述俩种生成 `Symbol` 的方式应该各有其适用的场景。

## Symbol 的使用场景
借助 `Symbol` 来实现单例模式
```js
const Instance = Symbol.for('instance')
function singleton() {
	if (singleton[Instance]) {
		return singleton[Instance]
	}
	
	return singleton[Instance] = {}
}
const a = singleton()
const b = singleton()
a === b // true
```
`Symbol` 作为对象的 Key 不会被当作普通的键值被遍历。  

但还是可以通过 `Object.getOwnPropertySymbols()` 来获得，所以通过 Symbol 并不能完全实现私有属性的需求。
```js
// 这里要注意 const o = { Symbol(): 2 } 这种写法会报错
const o = {
	foo: 1,
	[Symbol.for('bar')]: 2
}
Object.getOwnPropertyNames(o) // ['foo']
Object.getOwnPropertySymbols(o) // [Symbol(for)]
Object.keys(o) // ['foo']
for (let key in o ){
	console.log(key) // 'foo'
}
```  

## Built-in Symbols
个人认为 ES6 自身提供的 Built-in Symbols 才是最常见的使用方式。  

从这点来看 `Symbol` 对于语言内部实现来说确实有帮助，当协议制定者向原型链上新增属性或方法时就不用再担心与开发者产生命名冲突了，例如 `Symbol.iterator`:
```js
const arr = [1, 2, 3]
arr[Symbol.iterator] // native function
const it = arr[Symbol.iterator]() // 获得数组的 Iterator
```

以及 `Symbol.toStringTag`:
```js
const test = {
  [Symbol.toStringTag]: 'TestClass'
}
Object.prototype.toString.call(test) // "[object TestClass]"
```

值得一提的是这些内部的 `Symbol` 并不是像自定义的那样注册到全局库中，而是作为 `Symbol` 构造函数的静态属性存在。


想要更深入的了解推荐看一下[这篇文章](https://hacks.mozilla.org/2015/06/es6-in-depth-symbols/)。

完。