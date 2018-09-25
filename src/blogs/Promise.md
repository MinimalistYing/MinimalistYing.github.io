# Promise In ES6

## 序
以往我们通常用回调函数来处理异步编程
当嵌套过深时便会使程序的可读性很差（Callback Hell）
```js
function foo(cb) {
	asyncFunc1(() => {
		cb()
		asyncFunc2(() => {
			cb()
			asyncFun3(() => {
				cb()
			})
		})
	})
}
```
ES6新增的Promise提供了一种更优雅的方式来处理异步编程

## 如何构造一个基础的Promise
```js
const p = new Promise((resolve, reject) => {
	const rand = Math.random()
	setTimeout(() => {
		if (rand > 0.5) {
			resolve('finish')
		} else {
			reject('err')
		}
	}, 3000)
})

// 在3秒后输出'finish' or 'err'
p.then(res => console.log(res))
.catch(err => console.log(err))

// 同上
p.then(res => console.log(res), err => console.log(err))
```
一个Promise最终只会有俩个状态**fulfilled**或者**rejected**  
前者可以在`then()`的第一个参数中获得处理完成的结果  
后者可以在`then()`的第二个参数或者`catch()`中获得处理失败的原因  
每一个Promise只会被resolve(fulfill 或者 reject)一次  
并且一旦一个Promise执行完毕，它就成为了一个不可变的值  

## Promise是如何避免Callback Hell的
```js
function asyncFunc1() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('1 done')
		}, 3000)
	})
}

function asyncFunc2() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('2 done')
		}, 3000)
	})
}

function asyncFunc3() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('3 done')
		}, 3000)
	})
}

asyncFunc1().then(res => {
	console.log(res)
	return asyncFunc2()
}).then(res => {
	console.log(res)
	return asyncFunc3()
}).then(res => {
	console.log(res)
})
// 3s后 "1 done"
// 再3s后 "2 done"
// 再3s后 "3 done"
```
通过上例可以看出，正确的使用Promise可以使得我们程序中的异步流程更为清晰  
可以说完美的避开了Callback Hell

## Promise API

### Promise.resolve() 和 Promise.reject()
```js
const p1 = Promise.resolve(1)
const p2 = new Promise(resolve => resolve(1))

const p3 = Promise.reject(1)
const p4 = new Promise((resolve, reject) => reject(1))
```
可以通过`Promise.resolve()`将thenable对象转为真正的Promise对象  
如果你以前用了类似Promise语法的异步处理库  
现在想将其行为转成和Promise一致时可能会用到

### Promise.all([...])
该方法的入参是一个包含多个Promise对象的数组  
它会等到其中所有的Promise处理完成(fulfilled)后将结果集返回  
或者其中任意一个Promise处理失败(rejected)后将错误抛出
```js
const p1 = 1
const p2 = Promise.resolve(2)
const p3 = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve(3)
	}, 3000)
})

// 3s后输出 [1, 2, 3]
Promise.all([p1, p2, p3]).then(res => console.log(res))

const e1 = new Promise((resolve, reject) => {
	setTimeout(() => {
		reject('err')
	}, 1000)
})

// 1s后输出 "err"
Promise.all([p1, p2, p3, e1])
.then(res => console.log(res))
.catch(err => console.log(err))
```

### Promise.race([...])
与`Promise.all()`不同，该方法只会取入参中所有Promise中最快返回的结果  
不管是接受(resolve)或是拒绝(reject)  
其余Promise的处理结果都会被忽略
```js
const p1 = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve(1)
	}, 1000)
})
const p2 = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve(2)
	}, 2000)
})
// 1s后输出 1
// 无论执行多少遍都是该结果 永远不会输出2
Promise.race([p1, p2]).then(res => console.log(res))
```
要注意的是当传入空数组时`Promise.all([])`会立即执行完毕  
而`Promise.race([])`会永远处于等待状态，所以建议永远别这么使用Promise

## `async` + `await` （ES7）
当ES6的Generator与Promise异步编程共同使用时可以产生一些更酷的特性  
让我们能够像写同步代码一样去实现异步过程  
但是需要实现一个特殊的Runner来执行这个Generator  
ES7新增了语法糖`async`以及`await`来帮助我们更迅速的实现这一特性
```js
function asyncFunc1() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('1 done')
		}, 3000)
	})
}

function asyncFunc2() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('2 done')
		}, 3000)
	})
}

function asyncFunc3() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('3 done')
		}, 3000)
	})
}

async function main() {
	const res1 = await asyncFunc1()
	console.log(res1)
	const res2 = await asyncFunc2()
	console.log(res2)
	const res3 = await asyncFunc3()
	console.log(res3)
}

// 3s后 "1 done"
// 再3s后 "2 done"
// 再3s后 "3 done"
main()
```
可以看到，相较于`Promise.then(...).then(...)`  
这种方式让异步程序的执行过程更加一目了然
