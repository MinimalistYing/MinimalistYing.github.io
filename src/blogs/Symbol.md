# Symbols in ES6
ES6中新增了一种primitive type`Symbol`，可以把它看做一种自动生成一个唯一字符串的机制，它的真实值被隐藏在代码后且永远无法直接获得

## 如何生成Symbol
```
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
```
const a = Symbol()
typeof a === 'symbol'// true 最主要的判断方式

a instanceof Symbol // false
Object(a) instanceof Symbol // true
Object(a).valueOf() === a // true
```

## 如何获得Symbol的描述字符串
```
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
