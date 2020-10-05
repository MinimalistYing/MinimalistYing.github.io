# Virtual DOM 和 DOM Diff

## Virtual DOM
React 自身维护了一组描述 HTML 的树形数据，也就是我们通常说的 Virtual DOM。例如有如下 HTML ：
```html
<button class="button button-blue">
  <b>
    Hello
  </b>
</button>
```
对应的 Virtual DOM 大致是：
```js
const dom = {
  type: 'button',
  props: {
    class: 'button button-blue',
    children: [{
      type: 'b',
      props: {
        children: 'Hello'
      },
    }]
  },
}
```

优点：
* 轻量级对象，性能好
* React 不只可以在浏览器中使用还可以通过 React-Native 生成原生应用


## DOM Diff


[Fiber Example](https://claudiopro.github.io/react-fiber-vs-stack-demo/fiber.html)