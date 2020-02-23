# Symbols in ES6
`Symbol`是 ES6 (时隔多年) 新增的一种 **primitive type** ，可以把它看做一种自动生成 **唯一字符串** 的机制，它的真实值在代码中无法直接获得

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
通过上述对比，个人感觉用 `Symbol.for()` 来生成 `Symbol` 好像更加合适  
不仅可以少声明一个变量，并且能更方便的获得其描述

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

如果将上例中的 Symbol 替换成任意一个 Magic String 对逻辑的实现并无影响  
所以从个人经验来看 暂时还未碰到有必须要使用 Symbol 的场景  

```js
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

可以看到，虽然 Symbol 作为对象的 key 不会被当作普通的键值被遍历  
但还是可以通过 `Object.getOwnPropertySymbols()` 来获得  
所以通过 Symbol 并不能实现私有属性的需求

## Built-in Symbols
个人认为 ES6 自身提供的 Built-in Symbols 可能才是最常见的使用方式，例如 `Symbol.iterator`:
```js
const arr = [1, 2, 3]
arr[Symbol.iterator] // native function
const it = arr[Symbol.iterator]() // 获得数组的 Iterator
```
值得一提的是这些内部的 Symbol 并不是像自定义的那样注册到全局库中  
而是作为 Symbol 构造函数的静态属性存在
