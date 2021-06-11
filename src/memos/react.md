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

如果希望在React组件内部进行路由、页面跳转，可以借助React-Router提供的 `withRouter(comp)` 
之后便可在组件内部通过 `this.props.router` 来进行跳转。但有时候我们希望在组件外部来跳转，
这就需要借助history来实现
```js
import {browserHistory} from 'react-router'
browserHistory.goBack()
browserHistory.push()
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

在 React `children` 属性有着特殊的含义，所以如下代码

```js
function MyComponent (props) {
	return (
		<p>{props.children}</p>
	)
}

<MyComponent children='舒客舒克'>
	<button>按钮</button>
</MyComponent>
```
最终显示出来的是按钮而不是舒客舒克，但是如果是按照如下方式调用则会显示舒客舒克
```js
<MyComponent children='舒客舒克' />
```
由此可见在 React 中 `props.children` 会优先被传入的子元素覆盖

---

利用 *React Hooks* 模拟 Vue 的计算属性

```js
function App () {
	const [fistName, setFirstName] = useState('F')
	const [lastName, setLastName] = useState('L')

	const fullName = useMemo(() => {
		return `${firstName} ${lastName}`
	}, [firstName, lastName])

	return (
		<div>
			{fullName}
		</div>
	)
}
```