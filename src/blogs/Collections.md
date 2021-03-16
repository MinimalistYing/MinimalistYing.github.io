# New Collections In ES6

## Map
以往当我们需要一种键/值对形式的数据结构时通常使用的是原生的 `Object`。
```js
// 这里不直接通过 const o = {} 来创建对象是为了避免从原型上继承不必要的属性
const o = Object.create(null)
o[1] = 1
o['a'] = 'a'
console.log(o) // { 1: 1, a: 'a' }
o['1'] = 2
console.log(o) // { 1: 2, a: 'a' }

const map = Object.create(null)
const x = { a: 1 }
const y = { b: 2 }
map[x] = 1
map[y] = 2
// 因为x.toString() === '[object Object]'
console.log(map) // {[object Object]: 2}
```
可以看到这种方法其实有很多缺陷，稍后我们再具体分析。  
    
ES6 提供了对 Map 的原生支持，它可以将任何数据类型（Function / Object / Primitive Type）作为 Key。  
```js
const map = new Map()
const x = { a: 1 }
const func = () => {}
// 支持链式调用
map.set(x, 1)
	.set(2, 2)
	.set('2', '2string')
	.set(Symbol.for('sym'), 'symbol')
	.set(true, true)
	.set(func, 'function')

map.get(x) // 1
map.get(2) // 2
map.get('2') // '2string'
map.get(Symbol.for('sym')) // 'symbol'
map.get(true) // true
map.get(func) // 'function'

map.size // 5

map.delete(true)
map.delete(x)
map.delete('2')

map.size // 2

map.has(2) // true
map.has(Symbol.for('sym')) // true

// 可以通过 for of 进行遍历
for (let [key, value] of map) {
	console.log(key, value)
}

[...map.keys()] // [2, Symbol(sym)]
[...map.values()] // [2, "symbol"]
[...map.entries()] // [[2, 2], [Symbol(sym), "symbol"]]

map.clear()
map.size // 0
```
Map 的实例是 Iterable 的，并且其默认的 Iterator 与 `map.entries()` 返回的结果一致。  

所以下列方法都可以用于拷贝产生一个新的 Map。
```js
const map = new Map()
const copy2 = new Map(map.entries())
const copy1 = new Map(map) // 推荐 更简洁
```

Map 和 Array 存在一些特殊的关联：
```js
const first = [
	[1, 'a'],
	[2, 'b'],
	[3, 'c']
]
const second = [
	[1, 'foo'],
	[2, 'bar'],
]
// 可以通过 Array 来构造 Map
const firstMap = new Map(first) // Map(3) {1 => "a", 2 => "b", 3 => "c"}
const secondMap = new Map(second) // Map(2) {1 => "foo", 2 => "bar"}

// 可以利用这个特效来对 Map 进行 Merge 操作
const merged = new Map([...firstMap, ...secondMap]) // Map(3) {1 => "foo", 2 => "bar", 3 => "c"}
```

Map 的一些优势：
* 由于对象的 Key 只能是字符串(或者是 ES6 新增的 Symbol)，这样当把对象作为 Map 使用时同样只能以字符串作为键。而 ES6 的 Map 支持任意的数据类型作为 Key。
* 不需要担心会受到原型的影响，Map 只会包含你自己设置的值。
* Map 中所存储的键值对是有序的,先插入的值会在遍历时优先取出。(如果浏览器实现了 ECMAScript 2015 Spec 的话，Object 中的 String Key 也会是有序的)
* 可以很方便的通过 `Map.prototype.size` 来知道一共存储了多少值。
* 可以很方便的通过 `for (let [key, value] of map)` 进行遍历。
* 在频繁的操作 Map 时会获得性能上的提升。

## WeakMap
WeakMap 的大部分行为与 Map 一致，主要区别在于 WeakMap 对内存分配机制的特殊处理。  

WeakMap 的 Key 只能是 Object ，并且当作为 Key 的 Object 被 GC 回收后，其存储在 WeakMap 中的 Entry 也会随之被销毁。  

WeakMap 相较 Map 而言只提供了 `set()` `get()` `delete()` `has()` 四个有限的API，尤其适用于需要把不受我们控制的对象(例如 DOM 对象)作为 Key 值的情况。

## Set
ES6 新增的 Set 用于存储一系列不重复的值，其判断是否重复的规则除了 Set 会认为 +0 等与 -0 外都与 `Object.is()` 相同。
```js
const set = new Set()
const x = { a: 1 }
const y = { b: 2 }
// 支持链式调用
set.add(x).add(y).add(x)

set.size // 2

set.delete(y)
set.size // 1

set.has(x) // true
set.clear()
set.size // 0

set.add(1).add('1').add(2);
[...set.keys()] // [1, "1", 2]
[...set.values()] // [1, "1", 2]
// 与 Map 不同的是 Set 实例的默认 Iterator 与 `values()` 相同 
for (let val of set) { // 1 '1' 2
	console.log(val)
}

[...set.entries()] // [[1, 1], ["1", "1"], [2, 2]]
``` 
可以利用 Set 来进行数组去重：
```js
const arr = [1, 1, 2, 3, 3, 4, '4']
const unique = [...new Set(arr)]
console.log(unique) // [1, 2, 3, 4, "4"]
```
可以直接去重字符串：
```js
const str = 'aabbcc'
new Set(str) // Set(3) {"a", "b", "c"}
```

## WeakSet
同 WeakMap 类似，WeakSet 中存储的值只能是 Object，并且当 Object 被 GC 后 WeakSet 也会自动将其从集合中删除。
