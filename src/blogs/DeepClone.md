# JavaScript 中的深拷贝

## 简易方式
```js
function deepClone (o) {
  return JSON.parse(JSON.stringify(o))
}

const test = {
  number: 1,
  string: 'a',
  bool: true,
  undefined: undefined,
  null: null,
  nan: NaN,
  symbol: Symbol('sys'),
  func: () => {},
  object: {},
  array: [1, '2', true]
}

console.log(deepClone(test))
```
可以看到使用这种方法无法拷贝类似 `symbol`/`function`/`undefined` 等类型的数据在过程中会被丢失，然后 `NaN` 会被转化为 `null`。  

```js
const a = {
  name: 'a'
}
const b = {
  name: 'b'
}
a.b = b
b.a = a
console.log(a) // 循环引用

JSON.stringify(a) // Uncaught TypeError: Converting circular structure to JSON
```
如上，当数据出现循环引用时 `JSON.stringify()` 会直接报错，这种情况下该方式也是行不通的。

## 复杂实现
```js
function deepClone (o, refs = []) {
  // 原始类型直接返回即可
  // 这里要注意 null 这个特例
  if (typeof o !== 'object' || o === null) { return o }
  
  // 这段逻辑是为了解决存在循环引用时的问题
  // 如果没有这段会出现无限循环
  // 报错 Uncaught RangeError: Maximum call stack size exceeded
  // 通过保存已经克隆过的对象或数组的引用来避免重复克隆
  const alreadyCloned = refs.find(item => item === o)
  if (alreadyCloned) { return alreadyCloned }
  refs.push(o)
  
  if (Array.isArray(o)) { // Array
    const clone = []
    for (let item of o) {
      clone.push(deepClone(item, refs))
    }
    return clone
  } else { // Object
    const clone = {}
    for (let key of Object.keys(o)) { // key 为 String
      clone[key] = deepClone(o[key], refs)
    }
    for (let sym of Object.getOwnPropertySymbols(o)) { // key 为 Symbol
      clone[sym] = deepClone(o[sym], refs)
    }
    return clone
  }
}
```

## 总结
需要注意的问题主要有俩点：
* 待拷贝的对象存在循环引用
* 待拷贝的对象内存在一些特殊类型的数据
  
深入理解这个问题对理解 JavaScript 中的原始类型和引用类型很有帮助。

完。