# 阅读摘要 - YDKJS Types & Grammar

## Function
在 Javascript 中函数其实是一种可被调用的特殊对象，所以函数也可以拥有属性。例如：
```js
function func (a, b, c) {}
console.log(func.length)
```
`func.length` 是 3，代表着该函数有三个形参。

## 不要在数组上使用 delete
`delete` 操作会使数组产生 Empty Slot 
```js
const arr = [1, 2, 3]
console.log(arr.length, arr)
delete arr[2]
console.log(arr.length, arr)
```

## 值拷贝和引用拷贝
在 Javascript 中 `number / string / undefined / null / boolean / symbol` 等基础类型是值拷贝  

复杂类型 `object / function` 是引用拷贝，区别如下
```js
let a = 1
let b = a
b++

console.log(a, b)

let c = {}
let d = c
c.name = 'test'

console.log(c, d)
```

## Native Prototypes
可以作为默认的空值来使用，避免意外的报错
```js
function test(fn = Function.prototype, arr = Array.prototype) {
  return arr.map(fn).join('')
}

test() // 不会报错
```
Ps: 不是很建议使用 `Array.prototype` 来作为默认值，因为修改该数组会影响到其它同样使用的地方

## 其它
* `Infinity / Infinity` => `NaN`
* `new Error('message')` 和 `Error('message')` 的效果是一致的
* 在 Javascript 中 String 是不可变的，这意味着任何关于 String 的操作都不能改变原来的字符串而只能产生新的字符串。