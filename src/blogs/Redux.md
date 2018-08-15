# Redux入门

## 基本概念
前端应用日渐复杂，以往的JavaScipt+HTML+CSS三大件变得难以应对  
近几年出现的各类MVVM框架(React/Vue/Angular)将开发者从频繁地修改Dom操作解脱出来  
随之而来碰到的问题是在复杂单页应用(SPA)中对状态的管理  
各个组件有各自的状态，当一个组件的状态发生变更，同时也可能需要去触发另外一个组件状态的变更  
当这种耦合关系越来越多的时候，我们会发现很难去寻找状态变更的原由，也更可能的会不小心改变本该不变的状态  
Redux提供了一种更加规范的应用状态管理解决方案，当然代价是引入更冗余的语法(boilerplate)  
Redux通过以下三个原则来更好的管理应用的状态:  
* Single source of truth: 通过Redux管理的状态对于一个应用来说是唯一的  
存储在Redux的store中
* State is read-only: Store中存储的状态不能被直接修改  
只能通过Dispatch Action来进行应用状态的变更  
这样通过一些工具开发者可以很清楚的看到状态发生变更的时机以及每次发生的变化  
甚至进行Time Travel来回到某个Action执行前的状态  
亦或是再次重新提交这个Action来观察其行为对应用的影响  
* Changes are made with pure functions: Reducer不会直接去修改Store中的状态  
而是依据Dispatch的不同Actions返回新的状态  

### Actions
不同于直接去修改应用的状态，例如在react通过`this.setState()`  
Redux推崇通过dispacth action来修改状态  
Action是一个携带了操作类型以及具体改变数据的对象  
```js
const action = {
	// 操作类型 用于描述该次操作的用意
	// 通常由下划线分割的大写字符组成
	// 当有很多action事建议将type提取成常量
	type: 'ADD_PEOPLE',
	// 具体操作的数据
	people: {
		name: 'a'
	}
}
```
以上Action中的数据是固定的，可以通过一个ActionCreator来动态的生成数据  
```js
const actionCreator = people => ({
	type: 'ADD_PEOPLE',
	people
})
```
注意Action并不会真正的去改变状态，而是携带了待改变状态的相关信息  
需要通过'store.dispatch(action)'将Action派发至Reducer中进行状态的改变  
所以具体的状态改变逻辑应该在Reducer中去实现

### Reducer
Reducer用于定义根据收到的不同Action如何去改变应用的状态  
Reducer应该是一个Pure function,意味着不应该在其中去改变参数  
并且当入参相同时其返回值应该都是相同的  
```js
// 注意需要给我们应用设置一个初始化的initalState
// 因为默认的Redux会将state初始化为undefined
function reducer(state = initalState, action) {
	switch(action.type) {
		case 'ADD_PEOPLE':
			return { ...state, ...{ people: action.people } }
		// 在遇到意外的Action时需要将原先的state直接返回
		default:
			return state
	}
}
```
