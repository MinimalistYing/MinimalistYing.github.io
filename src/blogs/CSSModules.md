# CSS Modules

## CSS Modules 解决了什么问题
* 避免全局样式冲突
* 为了避免冲突而导致的样式嵌套层级过深(Less / Sass)
* 为了避免冲突而导致的样式命名过于复杂(BEM)

## 如何使用
Webpack 的 `css-loader` 就实现了 CSS Modules,只需在配置 `css-loader` 时加上 `modules: true` 即可，如下
```js
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        { loader: 'style-loader' },
        {
          loader: 'css-loader',
          options: {
            modules: true,
            getLocalIdent: '[path][name]__[local]--[hash:base64:5]' // 这样最后生成的类名会提供更多信息 方便 DEBUG   
          }
        }
      ]
    }
  ]
}
```
配置好后，不论是在 Vue / React / jQuery 中都可以开始使用 CSS Modules 了。  
假设 `style.css` 如下 
```css
.foo {
  color: red;
}
```
`index.jsx` 如下
```js
import style from './style.css'

ReactDOM.render(<h1 className={style.foo}>Hello World</h1>, document.getElementById('#app'))
```
如上代码，最终在页面上呈现的标题字体应该是红色的。  
并且可以看到 `<h1>` 标签上的实际类名是类似 `_2BQ9qrIFipNbLIGEytIz5Q` 的不规则字符串。  
这样哪怕你在多处用到 `.header` 这样简单的类名来声明样式，也不用担心会出现样式冲突了。

---

在开启 CSS Modules 后默认的样式都是局部的，也就是说类名会被处理生成唯一的字符串。  
当然有时我们也希望能设置一些会可以全局生效的样式（例如去覆盖一些 AntD 组件原有的样式），这个时候可以通过如下方式实现。
```less
:global(.foo) {
  color: red;
}

/* 在使用 LESS / SASS 也可以如下声明 */
:global {
  .bar {
    color: blue;
  }

  .test {
    color: green;
  }
}
```
全局样式的类名不会被处理，所以页面上所有符合选择器条件的元素都会正确的应用样式。

---

CSS Modules 还可以通过 `composes` 支持样式的复用。
```css
.base {
  background: black;
  font-size: 16px;
}

.redFont {
  composes: base;
  color: red;
}

.blueFont {
  composes: base;
  color: blue;
}
```
需要注意的是 `composes` 必须是第一条规则，也就是说如下写法是错误的。
```css
.blueFont {
  color: blue;
  composes: base;
}
```
还可以通过 `composes: classNameA classNameB;` 来从多个基类继承样式。

## 总结
工具归工具，正确的使用才能更好的解决问题。