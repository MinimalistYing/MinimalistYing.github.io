在Vue中使用Scoped Style时最好采用类选择器或Id选择器，这样会使与属性选择器连用
(PostCSS实现Scoped Style的方式)时造成的性能损失最小

---

利用`Webpack`的Code Splitting特性以及Vue的Async Component特性可以很容易的做到按需加载
```js
const Com = () => import('./my-async-compnent')
```

---

Vue-Router中路由配置的`redirect`和`alias`区别在于前者会将地址栏到URL重定向到新的而后者不改变URL，
使得不同的URL也可以绘制同样的组件
