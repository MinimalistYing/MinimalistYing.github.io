# Generator in ES6
## 序
Generator 不同于一般的函数，它可以在执行过程中被暂停然后在稍后的任意时刻恢复执行，并且在过程中可以与外界双向传递数据

## 如何写一个简单的 Generator
```js
function *foo() {
	return 'hello'
}

const it = foo()
it.next() // { value: 'hello', done: true}
```
与普通函数的不同的是调用一个 Generator 并不会立即执行函数体，而是返回一个 Iterator 来控制该函数的执行

## 如何写一个有意义的 Generator
Generator 最大的用途在于暂停函数逻辑的执行，需要借助 ES6 新增的关键字 `yield` 来实现
```js
function *foo() {
	const a = yield 'hello'
	console.log(a)
	
	const b = yield 'world'
	console.log(b)
	
	return 'finish'
}
```
下面来依次执行上述 Generator，看看每一步的结果
```js
const it = foo() // 获得 Generator 返回的 Iterator
it.next('step 1')
// {value: "hello", done: false}
```
初次执行，代码会停在 `const a = yield 'hello'` 处，`'hello'` 作为返回值被抛到函数外

需要注意的是此时 `next()`  中的参数还未真正传入函数，因为 **yield** 将自身替换为外部传入值的时机是在代码恢复执行时
```js
it.next('step 2')
// 'step 2'
// {value: "world", done: false}
```
第二次执行，代码会停在 `const b = yield 'world'` 处，我们在 `next()` 中传入的 `'step2'` 被赋值给变量 `a`

可以看做 `yield 'hello'` 被替换成了 `'step2'` ，`'world'` 作为返回值被抛出
```js
it.next('step 3')
// 'step 3'
// {value: "finish", done: true}
```
最后一次执行，`'step3'` 被赋值给变量 `b` ，Generator 执行完毕，`'finish'` 作为返回值被抛出

## `yield *`
**yield delegation** 可以把当前 Generator 的控制委派给另一个 Iterator  
```js
function *foo() {
	yield *[1, 2, 3]
}
for (v of foo()) {
	console.log(v) // 1 2 3
}
```
