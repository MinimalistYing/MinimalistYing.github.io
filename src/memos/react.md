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
	// 但是当需要传递多余参数当时候可能不得不采用这种这种形式
	// 下面会给出当碰到渲染长列表的性能问题时如何进行优化
	render() {
		return <button onClick={e => this.handleClick(e)}></button>
	}
}

class Alphabet extends React.Component {
	state = {
		num: null
	}
	// 通过将数据存放到 HTML 的 data-num 属性中来避免使用箭头函数引起的性能问题
	handleClick = e => {
		this.setState({
			num: e.target.dataset.num
		})
	}

	render() {
		return (
			<ul>
				{[1,2,3].map(num =>
					<li key={num} data-num={num} onClick={this.handleClick}>
						{num}
					</li>
				)}
			</ul>
		)
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

---

由于 React Component 只允许有一个根结点  
所以当碰到当我们当组件由一个列表组成时需要在最外层加上一个额外的 `<div>`  
```js
function Columns() {
	// 如果该组件嵌套在 <tr> 中 => <tr><Columns /></tr>
	// 会导致最终生成的 HTML 不符合标准 => <tr><div><td></td><td></td></div></tr>
	return (
		<div>
			<td></td>
			<td></td>
		</div>
	)
}
```
现在我们可以借助 `React.Fragment` 来解决这个问题
```js
function Columns() {
	return (
		<React.Fragment>
			<td></td>
			<td></td>
		</React.Fragment>
	)
}
```
如果不需要像 Fragment 传递 Props 或者 key, 可以采用简
```js
function Columns() {
	return (
		<>
			<td></td>
			<td></td>
		</>
	)
}
```

---

关于 React 中的组件名称为何需要以大写字母开头  
因为如下 JSX
```js
<Button />
```
经 Babel 编译后生成
```js
// 所以要求 Button 必须在作用域中可见
React.creatElement(Button, null)
```
而
```js
<button />
```
编译后生成的是
```js
// 直接生成 <button>  标签
React.creatElement('button', null)
```

---

当使用 Uncontrolled Component 时，如果想要指定一个输入框当默认值需要采用 `defaultValue`  
```js
<input defaultValue="默认值" />
```
因为直接设置 `value` 会导致输入框的值无法修改，因为 React 当每次 Render 都会根据 `value` 重新设置输入框的值  

---

`<input type="file" />` 只能是 Uncontrolled Component  
因为在前端文件只能通过用户交互来选择，不能在程序中控制

---

JSX 其实仅仅是一种方便我们写 React App 的语法糖，经过 Babel 编译最后的产出仍是 Vanilla Javascript
```js
const App = <div className="app">Hello World</div>
```
如让 JSX 编译后其实就是
```js
const App = React.creatElement('div', {
	className: 'app'
}, 'Hello World')
```

---

AntD 表格组件 `columns` 的 `filteredValue` 字段只接受字符串数组  
要注意把其它类型的 ID 转为字符串后再传入，否则会导致筛选项的多选框回填出现问题