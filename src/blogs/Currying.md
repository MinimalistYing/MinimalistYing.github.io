# 柯里化（Currying）

## 什么是柯里化？
首先看一下 Wiki 上给出的定义：
> 在计算机科学中，柯里化（英語：Currying），又译为卡瑞化或加里化，是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

下面用一段简单代码进行说明：
```js
/* 原函数 */
function add(a, b, c) {
  return a + b + c
}
add(1, 2, 3) // => 6

/* 柯里化 */
function curryingAdd(a) {
  return function (b) {
    return function (c) {
      return a + b + c
    }
  }
}

/* 箭头函数形式的柯里化 */
const func = a => b => c => a + b + c // => 6

curryingAdd(1)(2)(3) // => 6
```

## 一个简单的通用柯里化实现
Ps：项目里如果真需要用到柯里化建议使用 [_.curry](https://lodash.com/docs/4.17.15#curry)
```js
function curry (func) {
  return function curried (...args) {
    // func.length 是函数定义的形参个数
    if (args.length >= func.length) {
      return func.apply(this, args)
    } else {
      return function(...args2) {
        return curried.apply(this, [...args, ...args2])
      }
    }
  }
}

function add(a, b, c) {
  return a + b + c
}

const curryingAdd = curry(add)
curryingAdd(1)(2)(3)
```
Ps: 柯里化不会改变原函数，所以原函数还是可以照常被调用

## 柯里化有什么用？
简单来说，柯里化可以减少你调用同一个函数重复传入相同参数的情况，例如：
```js
function log (level, user, message) {
  console.log(`${level} - ${user} - ${message}`)
}

/* 未柯里化 */
log('error', 'me', 'error a')
log('error', 'me', 'error b')

const curryLog = curry(log)
const myErrorLog = curryLog('error', 'me')
/* 柯里化后 */
myErrorLog('error a')
myErrorLog('error b')
```
可以看到，如果一个函数被调用的次数越多的话柯里化的好处越明显。  

当然我想大多数人（包括我）更可能采用如下形式来实现这个目的：
```js
function myErrorLog (message) {
  log('error', 'me', message)
}
```
相较而言柯里化的优点是更灵活一点吧，比如当我们需要更多的 `log` 函数时柯里化明显会方便一些：
```js
const myErrorLog = curryLog('error', 'me')
const myWarnLog = curryLog('warn', 'me')
const myInfoLog = curryLog('info', 'me')
const otherErrorLog = curryLog('error', 'other')
```


## 总结
说实话，在日常的工作中可能很少有机会用到柯里化。  

但是理解其定义以及原理对熟悉函数式编程以及相关的 `Closure` 等概念会有所帮助。

## 参考文档
* [https://javascript.info/currying-partials](https://javascript.info/currying-partials)
* [https://stackoverflow.com/questions/36314/what-is-currying](https://stackoverflow.com/questions/36314/what-is-currying)