# 防抖 (Debounce) 和节流 (Throttle)
在浏览器中类似 `resize` / `scroll` / `input` 等事件都会连续触发，例如有个场景下需要在 `input` 事件触发时向后端发送请求，如果不做任何处理，当用户疯狂键入时就会在短时间内向服务端发送大量请求。  

一方面是这种行为没有必要，另一方面是这样做无疑会影响性能，这个时候就需要通过 `debounce` / `throttle` 的技巧来进行优化。

## Debounce
> The Debounce technique allow us to "group" multiple sequential calls in a single one.

使一定时间内多次触发的函数最终只执行一次的技术就叫做 Debounce，下面我们先来看一个最基础的实现：
```js
function debounce(func, wait) {
  let timer = null
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(func, wait)
  }
}
```
细心的同学可能已经发现了上述实现存在的问题
* 函数至少也会被延迟 `wait` 时间执行
* 函数执行时的参数以及上下文丢失

首先我们来支持可以立即执行的问题：
```js
function debounce(func, wait, immediate = false) {
  let timer = null
  return function () {
    if (timer) clearTimeout(timer)

    if (immediate) { // 立即执行
      if (!timer) {
        func()
      }
      timer = setTimeout(() => timer = null, wait)
    } else { // 最后执行
      timer = setTimeout(func, wait)
    }
  }
}
```
再来解决参数以及上下文丢失的问题：
```js
function debounce(func, wait, immediate = false) {
  let timer = null
  return function (...args) {
    const context = this
    if (timer) clearTimeout(timer)

    if (immediate) { // 立即执行
      if (!timer) {
        func.apply(context, args)
      }
      timer = setTimeout(() => timer = null, wait)
    } else { // 最后执行
      timer = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
}
```

## Throttle
使一定时间内多次触发的函数在一定时间间隔最多执行一次的技术就叫做 Throttle，它的一个典型使用场景就是滚动加载，下面我们先来看一个最基础的实现：

```js
function throttle(func, wait, immediate = false) {
  let timer = null
  return function(...args) {
    const context = this

    if (immediate) {
      if (!timer) {
        func.apply(context, args)
      }

      timer = setTimeout(() => {
        timer = null
      }, wait)
    } else {
      if (!timer) {
        timer = setTimeout(() => {
          timer = null
          func.apply(context, args)
        }, wait)
      }
    }
  }
}
```

## 总结
Debounce 和 Throttle 都用于优化高频次触发的事件处理函数，具体使用哪一个需要根据需求来判断。  

下面举一个具体一点的例子来帮助理解，假设我们需要去监听窗口的 `rezize` 事件，并将当前的尺寸打印到屏幕上。  

当用户在一段时间内不停拖动改变窗口大小时，如果我们想要的效果是当用户停下来后显示最终的尺寸则采用 Debounce，如果我们想要的效果是每秒钟都把当前尺寸显示一下则采用 Throttle。

## 参考文档
* [https://css-tricks.com/debouncing-throttling-explained-examples/](https://css-tricks.com/debouncing-throttling-explained-examples/)