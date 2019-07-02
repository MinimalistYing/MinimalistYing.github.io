# Vue 是如何实现数据双向绑定的

## Model => View
```html
<div id="test">{{ meassage }}</div>
```
假设有如上片段的 HTML ，我们希望当数据 `message` 变化时能同步修改页面上的展示
```js
const vm = {}
Object.defineProperty(vm, 'message', {
  set(value) {
    document.getElementById('test').innerText = value
  }
})
```
最基本的原理就是通过 `Object.defineProperty` 劫持对 `vm` 设值的过程  
在每次值发生变动时去修改相应对 View ，当然 Vue 的实现不会这么简单  

## View => Model
```html
<input id='test' />
```

## 发布订阅模式
可以看到如果数据在多处被使用，就需要在 `get()` 中实现多个修改 Dom 的逻辑  
这里就是一个典型的可以用到观察模式（Observer Pattern）/ 发布订阅模式（Publish–Subscribe Pattern）的场景  
数据改变的事件会发布到调度中心，当变化发生时会通知到所有订阅者
