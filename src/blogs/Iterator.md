# Iterator in ES6
## Iterator 与 Iterable
Iterator可以看做一个拥有特定格式的对象，可供ES6提供的遍历->`for of`和解构->`...`等操作消费，并按顺序依次产出结果，样例如下
```js
// IteratorResult
{
	value: ..., // 每次迭代产出的真实值
	done: ..., // true|false true代表迭代结束 与true相对应的value一般建议为undefined
}
// Iterator
{
	// 必须 用于返回每次迭代的结果集
	next() { return IteratorResult},
	// 可选 用于在结束迭代时做相应的资源清理操作
	return() {},
	// 可选 用于抛出异常信息
	throw() {}
}
```
而Iterable则是指一个对象实现了Iterable接口(简单来说就是对象上有一个key为Symbol.iterator的方法并且这个方法会返回一个Iterator)
```js
{
	[Symbol.iterator]() {return Iterator}
}
```

## 如何构造一个Iterable对象
```js
let rand = Math.random()
// 会随机产生一串数字的Iterable对象
const iterable = {
	// 必备!!! 这样才能使该对象变为Iterable
	[Symbol.iterator]() {return this},
	// 依次去获取数据
	next() {
		if (rand > 0.5) {
			rand = Math.random()
			return {
				value: rand,
				done: false
			}
		} else {
			return {
				done: true
			}
		}
	}
}
// 该对象可以用for of遍历
for (let value of iterable) {
	console.log(value)
}
```

## ES6自带的Iterable数据结构
包括`String` `Map` `Set` `Array`等
```js
const str = 'abc'
const arr = [1, 2, 3]
const map = new Map()
map.set('a', 1)
map.set('b', 2)
for (let v of str) {
	console.log(v) // 'a' 'b' 'c'
}
for (let v of arr) {
	console.log(v) // 1 2 3
}
for (let v of map) {
	console.log(v) // ['a', 1] ['b', 2]
}
```
