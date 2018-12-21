## Object's New API In ES6

### Object.is()
该方法用于比较俩个值是否相等，基本的比较逻辑与 `===` 一致但是更加严格
```js
const x = NaN
const y = 0
const z = -0

x === x // false
Object.is(x, x) // true
y === z // true
Object.is(y, z) // false
```
当不需要考虑这几种特殊情况时，直接用 `===` 比较更方便

### Object.getOwnPropertySymbols()
ES6 新增的 `Symbol` 可以作为对象上的特殊属性使用  
有时我们可能希望只获得一个对象上的所有 `Symbol` 属性，排除其他普通属性  
这个时候就可以借助该方法
```js
const o = {
	foo: 'hello',
	[ Symbol('bar') ]: 'world'
}

const symbols = Object.getOwnPropertySymbols(o) // [Symbol(bar)]
o[symbols[0]] // 'world'
```

### Object.setPrototypeOf()
该方法提供了一种更优雅的方式来修改一个对象的原型
```js
const o1 = {
	bar: 1
}
const o2 = {
	foo: 2
}

Object.setPrototypeOf(o1, o2)
o1.foo // 2
o1.__proto__ === o2 // true

// 将o1设置为无原型对象 类似 const o = Object.create(null)
// 这种做法通常是为了获得一个纯净的对象来作为 Map 使用
// 现在ES6新增了原生的 Map 结构 可以考虑避免使用这种技巧
Object.setPrototypeOf(o1, null)
o1.__proto__ // undefined
```

### Object.assign()
由于 React / Vue / Angular 等数据驱动的前端框架的流行  
这个方法在平常项目中使用频率很高，用于将一系列对象中的值复制到目标对象中  
并且会对各对象相同 key 的 (enumerable) 值按先后顺序进行覆盖
```js
let o1 = { a: 1 }
let o2 = { b: 2 }

Object.assign({}, o1, o2) // { a: 1, b: 2 }

Object.defineProperty(o2, 'c', {
	value: 3,
	enumerable: false
})

Object.defineProperty(o2, 'd', {
	value: 4,
	enumerable: true
})

// 可以看到 enumerable 为 false 的属性不会被拷贝
Object.assign({}, o1, o2) // { a: 1, b: 2, d: 4}

o2[Symbol('bar')] = 5
// Symbol 属性也会被拷贝
Object.assign({}, o1, o2) // { a: 1, b: 2, d: 4, Symbol(bar): 5}
```
值得注意的是，该方法的拷贝过程是浅拷贝  
类似于对每个属性进行 `target = src` 的赋值  
所以碰到数组、对象之类的复杂数据结构时要多加小心
