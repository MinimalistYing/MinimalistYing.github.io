# React-Redux 从入门到后悔

## 序
Redux作为一个简单的用于管理应用状态的工具，可以与任何其它的前端框架共用  
当然，尤其适用于数据驱动视图的框架(Vue/React/Angular)  
为了避免让我们自己将Redux的Store一层一层往子组件传递  
然后在一遍遍通过subscribe来监听Store的变化并去修改组件的状态  
React-Redux利用高阶组件(HOC)  
将上述逻辑封装到了`<Provider>`以及`connect()`俩个简单的API中  
当开发者想在React中使用Redux时，React-Redux将会是必不可少的帮手

## How to use
首先，用Redux提供的`<Provider>`包裹根组件
```js
// 新建Redux的Store
const store = createStore(reducers)

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
)
```

## 阅读源码看到的小技巧
React-Redux 默认通过以下方法来比较组件的Props是否相等  
如果不等则意味着组件需要进行重绘
```js
// 通过hasOwn.call(xx, xx)
// 相较于xx.hasOwnProperty(xx) 更简洁？
const hasOwn = Object.prototype.hasOwnProperty

// Object.is()的Polyfill
function is(x, y) {
	if (x === y) {
		// Object.is(0, -0) => false
		return x !== 0 || y !== 0 || 1 / x === 1 / y 
	} else {
		// Object.is(NaN, NaN) => true
		return x !== x && y !== y
	}
}

export default function shallowEqual(a, b) {
	if (is(a, b)) return true
	
	// 如果a或者b不是object 并且Object.is(a, b) => false
	// 则认为a和b不等
	if (typeof a !== 'object' || a === null ||
		typeof b !== 'object' || b === null
	) {
		return false
	}
	
	const keysA = Object.keys(a)
	const keysB = Object.keys(b)
	
	// 在a和b都是object的情况下
	// 如果a与b的所有key值相同 并且与之对应的value都满足Object.is(v1, v2) => true
	// 则也认为a和b相等
	if (keysA.length !== keysB.length) return false
	for (let i = 0; i < keysA.length; i++) {
		if (!hasOwn.call(b, keysA[i]) ||
			!is(objA[keysA[i]], objB[keysA[i]])
		) {
			return false
		}
	}
	
	return true
}
```
