# Array's New API In ES6
## Static Function

### Array.of()
大部分情况下我们都应该优先使用字面量的形式 `const a = [1, 2]` 来创建一个数组  
但当我们定义了一个自己的 Array 子类，并且想要创建子类的数组时就只能通过构造器来实例化了
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
一般情况下上例做法也不会有问题，但是当只传入一个参数时就会产生 empty slots（可能是因为历史原因？）
```js
const b = new MyArr(3) // 通过这种方式生成的不是 [3] 而是 [empty * 3]
b.length // 3
b.max() // undefined
```
使用 `Array.of()` 来实例化新数组可以避免上述问题
```js
const c = MyArr.of(3) // [3]
c.length // 1
c.max() // 3
```

### Array.from()
`Array.from` 可用于数组的转化，假设我们有一个 Array-Like Object
```js
const o = {
	length: 2,
	0: 'hello',
	1: 'world'
}

const a = Array.from(o)
const b = Array.prototype.slice.call(o) // 以往的方式
```
可以看到，在 ES6 中我们可以很方便的将其转化为一个真正的数组，并且不用担心会产生 empty slots
```js
const o = {
	length: 2,
	0: 'hello'
}

const a = Array.from(o) // ["hello", undefined]
const b = Array.prototype.slice.call(o) // ["hello", empty]
```
该方法的第一个参数可以是任意 Iterable 的对象，并将其迭代产生的值依次放到一个数组中返回
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

### copyWithin(target, start, end)
该方法可以将数组的一部分复制到该数组特定位置，并覆盖原值  
会直接修改原数组而不是产生一个新数组
```js
let arr = [1, 2, 3, 4, 5]
// 可以看到不明确提供 start 和 end 参数时该方法会从下标0处开始尽可能的拷贝更多的值
arr.copyWithin(1) // [1, 1, 2, 3, 4]

arr = [1, 2, 3, 4, 5]
arr.copyWithin(1, 0) // [1, 1, 2, 3, 4]

arr = [1, 2, 3, 4, 5]
arr.copyWithin(1, 0, 0)  // [1, 2, 3, 4, 5]

arr = [1, 2, 3, 4, 5]
arr.copyWithin(1, 0, 1)  // [1, 1, 3, 4, 5]

arr = [1, 2, 3, 4, 5]
// 拷贝过程并不是严格的按照从左到右一个个执行的
// 若果严格按照顺序执行的话，程序的结果应该是[1, 2, 2, 2, 2]
// 可以假定执行过程如下
// [1, 2, 2, 4, 5]
// [1, 2, 2, 2, 5]
// [1, 2, 2, 2, 2]
arr.copyWithin(2, 1) // [1, 2, 2, 3, 4]
```
### fill(value, start, end)
该方法可以向数组中的指定位置填充值
```js
// 未明确指定start和end时会尽可能的填充更多的值
new Array(3).fill('hello') // ['hello', 'hello', 'hello']
[null, null, null].fill('hello', 1) // [null, 'hello', 'hello']
[null, null, null].fill('hello', 1, 2) // [null, 'hello', null]
```

### find()
以往我们想要判断数组中是否包含某个元素通常是借助 `indexOf()`
```js
const arr = [1, '2', {name: 'hello'}]
arr.indexOf(1) !== -1 // true
arr.indexOf('2') !== -1 // true
arr.indexOf(2) !== -1 // false
```
这种方法有几个缺点:
* 通过严格的===来比较
* 需要通过判断是否等于-1来得出我们要的布尔值结果
* 不能实现自定义的匹配条件

ES5 中新增的 `some()` 解决了上述问题
PS: 当我们不需要自定义匹配条件，想利用全等来比较时  
可以采用ES7新增的更便捷的方法 `Array.prototype.includes()`
```js
const arr = [1, '2', {name: 'hello'}]
arr.some(v => v == 2) // true
arr.some(v => v.name === 'hello') // true

arr.includes(1) // true
```
大部分情况下这种方法都没有问题，但当我们想要直接获得正确匹配到的值  
这时候就可以借助ES6的 `find()`
```js
const arr = [1, '2', {name: 'hello'}]
arr.find(v => v == 2) // '2'
arr.find(v => v,name === 'hello') // {name: 'hello'}
arr.find(v => v === 666) // undefined
```

### findIndex()
总结一下上述数组的查找方法，可以发现，当我们只想确定是否存在特定值时可以采用`some()`  
当我们想拿到符合比较条件的值时可以采用 `find()`  
如果我们想要拿到符合比较条件值的下标时就需要用到ES6的 `findIndex()`
```js
const arr = [1, '2', {name: 'hello'}]
arr.findIndex(v => v == 2) // 1
arr.findIndex(v => v,name === 'hello') // 2
arr.findIndex(v => v === 666) // -1
```
不难发现该方法和 `indexOf()` 的差别仅在于可以自定义匹配条件

### entries() values() keys()
类似`Map` `Set`等ES6新增的 Collections，Array也提供了一系列的借助 Iterator 的迭代方法
```js
const arr = [1, 2, 3]
[...arr.values()] // [1, 2, 3]
[...arr.entries()] // [[0, 1], [1, 2], [2, 3]]
[...arr.keys()] // [0, 1, 2]
```
