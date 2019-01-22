React组件中的HTML标签必须闭合，否则会编译报错，例如 `<img>` 必须写作 `<img/>`

---

如果确定一个Component再初始化后不需要重新render，可以在组件中声明
```js
shouldComponentUpdate (nextProps, nextState) {return false;}
```
这会使React跳过对该组件是否需要重绘的检查，并且跳过调用
* componentWillUpdate()
* render()
* componentDidUpdate()
获得性能上的提升。
还有一种情况下，如果你希望只有在组件的部分属性发生变化时才检查，可以通过在上述方法中比较
`nextProps` 和 `nextState` 中的指定值是否发生变化来实现。
还可以通过继承React提供的 `React.PureComponent` 来方便的实现上述需求，
PureComponent只会对属性进行浅比较，当属性的数据结构复杂，层级较深时比较可能会失败
从而一直返回false导致组件不会发生更新
就最近的经验来看，把一些展示型的组件设为PureComponent可以获得较为明显的性能提升

---

关于React中的Event Handlers传参数有一下俩种方式
```html
<button onClick={(e) => this.func(id, e)}>click</button>
```
或者
```html
<button onClick={this.func.bind(this, id)}>click</button>
```
第二种方式下的 `e` 会默认作为最后一个参数传递

---

使用React-Router(3.x版本 其它版本估计也一样)，如果在 `<Router history={xxx}>` 上不配置 `history`
会报错 `Uncaught TypeError: Cannot read property 'getCurrentLocation' of undefined` 所以这个属性是SPA必配？

---

关于React-Router中 `browserHisory` 和 `hashHistory` 的区别，
前者的URL类似 `xx/xx` 后者是 `/#/xx` 由于HTTP协议的约定，URL中 `#` 后作为片段(frag)不会随请求发送至后台，
所以不需要服务器进行特殊配置，而前者是借助浏览器下的 `history` API实现，
在IE8/9下会导致跳页时Full Load，并且需要服务器配置接受所有请求都返回 `index.html` 。
优点时使得站点有清晰干净的URL，并且服务器端渲染只能通过这种方式实现，固推荐使用 `browserHistory`

---

如果希望在React组件内部进行路由、页面跳转，可以借助React-Router提供的 `withRouter(comp)` 
之后便可在组件内部通过 `this.props.router` 来进行跳转。但有时候我们希望在组件外部来跳转，
这就需要借助history来实现
```js
import {browserHistory} from 'react-router'
browserHistory.goBack()
browserHistory.push()
```

---

React-Router采用动态路由的形式时页面报错 `The root route must render a single element`
可能是因为React组件是采用ES6的 `export default` 导出，
而React-Router是采用CommonJS来 `require` 所以需要在导出的组件后加上 `.default` 
类似 `require('components/Comp')).default`

---

初学者在 React 中处理事件时会碰到 `this` 指向为 `undefined` 的问题
```js
class Button extends React.Component {
	handleClick() {
		console.log(this)
	}
	
	render () {
		return <button onClick="this.handleClick"></button>
	}
}
```
如果在页面上点击上述组件会发现打印出来的是 `undefined`  
当我们想要在函数中通过 `this.setState()` 去改变组件状态时会报错  
解决这个问题可以通过下面三种方式
```js
class Button extends React.Component {
	constructor() {
		// 借助 Function.prototype.bind
		this.handleClick = this.handleClick.bind(this)
	}
	handleClick() {
		console.log(this)
	}
	
	render() {
		return <button onClick={this.handleClick}></button>
	}
}
```
```js
class Button extends React.Component {
	// 使用 public class fields syntax 来声明函数
	handleClick = () => {
		console.log(this)
	}
	
	render() {
		return <button onClick={this.handleClick}></button>
	}
}
```
```js
class Button extends React.Component {
	handleClick() {
		console.log(this)
	}
	
	// 借助箭头函数
	// 这种方式的缺点是每次 Button 组件的重绘都需要生成一个新函数
	// 当这个函数被当作 props 传入子组件时 可能会导致不必要的重绘
	// 所以更推荐采用先前的俩种方式
	render() {
		return <button onClick={e => this.handleClick(e)}></button>
	}
}
```

---

在 HTML 中一个带有初始值的输入框可以简单写作 `<input value="hello" />`  
但在 React 中由于推崇使用 Controlled Component  
```js
ReactDOM.render(<input value="hello" />, document.getElementById('root'))
```
会发现上述代码生成的输入框虽然正确设置了初始值但是用户无法对其进行修改  
要修复这个问题需要加上
```js
setTimeout(() => {
	ReactDOM.render(<input value={null} />, document.getElementById('root'))
}, 1000)
```
也就是在一段时延后将其 value 修改为 `null`  
当然最好的方式还是直接使用 Controlled Component
