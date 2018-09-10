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
