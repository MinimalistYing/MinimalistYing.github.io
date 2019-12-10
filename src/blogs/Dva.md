# Dva 从入门到弃坑

## 源码中学习到的小技巧
借助 `Array.prototype.reduce` 将一个对象进行过滤，得到只包含所需 Key 的新对象
```js
const obj = {
  a: 1,
  b: 2,
  c: 3,
  bar: 4,
  foo: 5
}
const target = ['a', 'b', 'c'] 
const filtered =Object.keys(obj).reduce((temp, key) => {
  if (target.indexOf(key) > -1) {
    temp[key] = obj[key]
  }
  return temp
}, {})

console.log(filtered) // { a: 1, b: 2, c: 3 }
```