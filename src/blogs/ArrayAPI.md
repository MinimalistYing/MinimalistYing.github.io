# Array's New API In ES6
## Static Function

### Array.of()
大部分情况下我们都应该优先使用字面量的形式`const a = [1, 2]`来创建一个数组  
但当我们定义了一个自己的Array子类，并且想要创建子类的数组时就只能同过构造器来实例化了
```js
class MyArr extends Array {
	max() {
		let max = this[0]
		this.map(item => {
			max = Math.max(item, max)
		})
		return max
	}
}

const a = new MyArr(1, 2, 3)
a.max() // 3
```
一般情况下上例做法也不会有问题，但是当只传入一个参数时就会产生empty slots（可能是因为历史原因？）
```js
const b = new MyArr(3) // 通过这种方式生成的不是 [3] 而是 [empty * 3]
b.length // 3
b.max() // undefined
```
使用`Array.of()`来实例化新数组可以避免上述问题
```js
const c = MyArr.of(3) // [3]
c.length // 1
c.max() // 3
```

### Array.from()
`Array.from`可用于数组的转化，假设我们有一个Array-Like Object
```js
const o = {
	length: 2,
	0: 'hello',
	1: 'world'
}

const a = Array.from(o)
const b = Array.prototype.slice.call(o) // 以往的方式
```
可以看到，在ES6中我们可以很方便的将其转化为一个真正的数组，并且不用担心会产生empty slots
```js
const o = {
	length: 2,
	0: 'hello'
}

const a = Array.from(o) // ["hello", undefined]
const b = Array.prototype.slice.call(o) // ["hello", empty]
```
该方法的第一个参数可以是任意Iterable的对象，并将其Iterator产生的值依次放到一个数组中返回
```js
// 可用于复制数组
const arr = [1, 2, 3]
const arrCopy = Array.from(arr) // 更简洁 更易理解
const arrCopy2 = arr.slice() // 以往的方式
```
该方法的第二个参数可以接受一个函数，并依次对每一个值通过函数处理后再放到结果数组中
```js
const arr = [1, 2, 3]
const arrCopy = Array.from(arr, item => item + 1) // [2, 3, 4]
```

## Prototype Method

### copyWithin()
