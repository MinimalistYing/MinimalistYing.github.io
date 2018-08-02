# New Collections In ES6

## Map
以往当我们需要一种键/值对形式的数据结构时通常考虑采用原生的Object
```js
const o = {}
o[1] = 1
o['a'] = 'a'
console.log(o) // { 1: 1, a: 'a'}
o['1'] = 2
console.log(o) // {1: 2, a: 'a'}

const map = {}
const x = { a: 1 }
const y = { b: 2 }
map[x] = 1
map[y] = 2
// 因为x.toString() === '[object Object]'
console.log(map) // {[object Object]: 2}
```
可以看到这种方法有一个缺陷，由于Object的Key只能是字符串  
这样生成的Map同样只能以字符串作为键  
ES6提供了对Map的原生支持，它可以将任何数据类型作为Key
```js
const map = new Map()
const x = { a: 1 }
// 支持链式调用
map.set(x, 1).set(2, 2).set('2', 2)
	.set(Symbol.for('sym'), 'symbol').set(true, true)

map.get(x) // 1
map.get(2) // 2
map.get('2') // 2
map.get(Symbol.for('sym')) // 'symbol'
map.get(true) // true

map.size // 5

map.delete(true)
map.delete(x)
map.delete('2')

map.size // 2

map.has(2) // true
map.has(Symbol.for('sym')) // true

[...map.keys()] // [2, Symbol(sym)]
[...map.values()] // [2, "symbol"]
[...map.entries()] // [[2, 2], [Symbol(sym), "symbol"]]

map.clear()
map.size // 0
```
Map的实例是Iterable的，并且其默认的Iterator与`map.entries()`一致  
所以以下方法都可以用于拷贝产生一个新的Map
```js
const map = new Map()
const copy2 = new Map(map.entries())
const copy1 = new Map(map) // 推荐 更简洁
```

## WeakMap
WeakMap的大部分行为与Map一致，主要区别在于WeakMap对内存分配机制的特殊处理  
WeakMap只接受把Object作为Key，并且当作为Key的对象被GC回收后  
其存储在WeakMap中的Entry也会随之被销毁  
WeakMap相比Map只提供了`set()` `get()` `delete()` `has()` 四个有限的API  
尤其适用于需要把不受我们控制的对象(例如DOM对象)作为Key值的情况

## Set
ES6新增的Set用于存储一系列不允许重复的值  
其判断是否重复的机制与`Object.is()`几乎相同，除了Set会认为0与-0相等
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
[...set.entries()] // [[1, 1], ["1", "1"], [2, 2]]
```
与Map不同的是Set实例的默认Iterator与`values()`相同  
可以利用Set来进行数组去重
```js
const arr = [1, 1, 2, 3, 3, 4, '4']
const unique = [...new Set(arr)]
console.log(unique) // [1, 2, 3, 4, "4"]
```

## WeakSet
同WeakMap类似，WeakSet只接受Object作为值  
并且当对象被GC后WeakSet也会将其从集合中删除
