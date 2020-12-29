# 「YDKJS Types & Grammar」

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

## JSON Stringify
Javascript 中的部分类型不能被序列化为 JSON 字符串，例如：
* `Function / Symbol / undefined` 作为对象的值会被忽略，作为数组的值会被转为 `null`
  ```js
  JSON.stringify([undefined, Symbol('xxx'), () => {}])
  // "[null,null,null]"
  ```
* 循环引用的对象会报错 `Uncaught TypeError: Converting circular structure to JSON`
  ```js
  const a = {}
  a.a = a

  JSON.stringify(a)
  ```
* `BigInt` 类型会报错 `Uncaught TypeError: Do not know how to serialize a BigInt`
  ```js
  JSON.stringify(2n)
  ```
* `NaN / Infinity / -Infinity` 作为对象的值或者作为数组的值都会被转为 `null`

可以通过实现 `toJSON` 方法来自定义对象被序列化为 JSON 字符串的行为：
```js
const o = {
  str: 'hello',
  func: (a, b, c) => {},
  
  toJSON (key) {
    if (key) { // 是否是一个对象或者数组的值
      return 'Oops!'
    } else {
      return {
        str: this.str + 'world',
        func: this.func.length
      }
    }
  }
}

JSON.stringify(o)
// "{"str":"helloworld","func":3}"

JSON.stringify({ o })
// "{"o":"Oops!"}"
```

## Global DOM Variables
在新的HTML5规范中，如果一个元素拥有 ID 属性，或者下列标签中的元素拥有 name 属性：
* `<a>`
* `<applet>`
* `<area>`
* `<embed>`
* `<form>`
* `<frame>`
* `<frameset>`
* `<iframe>`
* `<img>`
* `<object>`

都会被新建一个以 ID / name 为键值的全局变量，例如页面上有如下元素：
```html
<div id="a">Hello</div>
```
在脚本中
```js
console.info(a)  // 结果为 <div id='a'></div>
```

## 其它
* `Infinity / Infinity` => `NaN`
* `new Error('message')` 和 `Error('message')` 的效果是一致的
* 在 Javascript 中 String 是不可变的，这意味着任何关于 String 的操作都不能改变原来的字符串而只能产生新的字符串。
* 注意可能存在一些特殊的对象在被转为布尔值时是 `false` ，典型的例如 `document.all`，通常是因为一些历史遗留问题。
* 可以通过 `Date.now()` 以及 `new Date().getTime()` 来获取当前时间的时间戳（毫秒级），要注意 UNIX 时间戳是秒级的，所以有时需要在前端进行转换。
* 在 Javascript 中 `||` 和 `&&` 操作符返回的不是布尔值而是根据条件返回俩个表达式中的一个。
* 在 Javascript 中没有 `else if` 关键字，只有 `if` 和 `else` ，之所以我们可以使用 `if ... else if ... else ...` 其实是因为省略了 `{}` 的结果。