# Symbols in ES6
ES6中新增了一种**primitive type**`Symbol`，可以把它看做一种自动生成一个**唯一字符串**的机制，它的真实值被隐藏在代码后且永远无法直接获得

## 如何生成Symbol
```js
// 最基础的方式
const a = Symbol()

// 可以传入一串描述该Symbol用途的字符串作为参数
const b = Symbol('some description text')

// 从全局的Symbol库中查询所需的Symbol
// 如果未找到则新建一个并返回
// 这种方式较以上直接构造Symbol的优点在于
// 可以不必在外部作用域中专门维护一个变量用于存储生成的Symbol
const c = Symbol.for('my Symbol')

// 由于不管如何Symbol都是全局存在的
// 为了尽量避免可能发生的冲突 可以给Symbol添加相应的前缀
const d = Symbol.for('prefix.Symbol')
```

## 如何判断一个值是否为Symbol
```js
const a = Symbol()
typeof a === 'symbol'// true 最主要的判断方式

a instanceof Symbol // false
Object(a) instanceof Symbol // true
Object(a).valueOf() === a // true
```

## 如何获得Symbol的描述字符串
```js
const a = Symbol('desc a')
const b = Symbol.for('desc b')

Symbol.keyFor(a) // undefined
Symbol.keyFor(b) // desc b

a.toString() // Symbol(desc a)
b.toString() // Symbol(desc b)
```
通过上述对比，个人感觉用`Symbol.for()`来生成`Symbol`好像更加合适
不仅可以避免使用不必要的变量污染作用域，并且能更方便的获得其描述

## Symbol的用途
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

如果将上例中的Symbol替换成任意一个不规则字符串-'Magic String'对逻辑的实现来说其实并无影响
所以从某种方面看来，Symbol的出现更多的是对代码或者说程序层面上的提升，并没有功能上的提升

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

可以看到，虽然Symbol作为Object的属性key不会被当作普通的键值被获取
但是还是有特殊途径来获得，所以并不能通过Symbol把Object的部分属性隐藏(外部不可访问)

```js
const arr = [1, 2, 3]
arr[Symbol.iterator] // native function
```

ES6提供了一系列的Built-in Symbols，值得一提的是这些内部的Symbol并不是像我们自定义的那样注册到全局的库中
而是作为Symbol函数的属性提供
