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

### Store
每一个应用都只能有一个唯一的Store，通过`createStore(reducers)`来生成  
用于维护应用的所有State，以及提供一些静态方法用于改变、获取当前状态  
```js
store.getState() // 获取当前状态
store.dispatch(action) // 提交action来改变当前状态
const unsubscribe = store.subscribe(listener) // 监听事件
unsubscribe() // 取消监听
```

## 进阶

### Middleware
Redux提供的中间件使开发者可以在每次`dispatch(action)`前后加上一些特定的逻辑  
例如logging/routing等，中间件的通用写法如下  
```js
const middleware = store => next => action => {
	// 在dispatch前执行的逻辑
	// ...
	
	const result = next(action)
	
	// ...
	// 在dispatch完成后执行的逻辑
	return result
}
```

### utils/warning.js
Redux通过该函数在运行时向控制台输出错误或提示信息方便开发者Debug
```js
export default function warning(message) {
	// 为了增强程序的Robusty 只有当前运行的宿主环境存在console
	// 并且console.error是函数才去调用 使得任何情况下都不会因为该函数报错
	// 中断程序的正常运行
	if (typeof console !== 'undefined' && typeof console.error === 'function') {
		console.error(message)
	}
	
	// 下面这段代码只有当我们打开浏览器的Console
	// 并且开启break on all exceptions功能时
	// 才会在每次报错或提示时暂停程序执行(相当在出错的那行打断点)
	// 否则的话可以说相当于注释掉的代码 不会有任何作用
	// 同样是为了方便开发者进行Debug
	try {
		throw new Error(message)
	} catch (e) {}
}
```

### utils/isPlainObject.js
由于Redux中要求Action必须是Javascript中的Plain Object  
所以这个工具函数用于判断一个对象是否满足该条件  
会在`dispatch(action)`执行最开始处进行判断，如果传入的action不满足条件会抛出错误  
Plain Object指的是直接通过`{}`或者`new Object()`生成，原型链上并没有其它对象的Object
```js
export function isPlainObject(obj) {
	// 如果对象都不是当然也不是PlainObject
	// 这里注意的是 obj === null 这个判断
	// 因为在Js中 typeof null === 'object'
	if (typeof obj !== 'object' || obj === null) return false
	
	// lodash中的isPlainObject多了这个逻辑
	// 主要考虑到这个特殊情况 const o = Object.create(null)
	// 此处的o应该也满足条件 isPlainObject(o) // => true
	if (Object.getPrototypeOf(obj) === null) {
		return true
	}
	
	let proto = obj
	// 因为 Object.getPrototypeOf(Object.prototype) === null
	// 所以当循环结束时 proto 指向的其实就是Object.prototype
	// 也就是说此时的proto === Object.prototype
	while (Object.getPrototypeOf(proto) !== null) {
		proto = Object.getPrototypeOf(proto)
	}
	
	// 如果传入对象的prototype与Object.prototype一致
	// 则认为该对象是Plain Object
	// 所以最终的判断逻辑其实与obj.__proto__ === Object.prototype类似
	// 上面的代码更多的是在考虑edge case
	return Object.getPrototypeOf(obj) === proto
}
```
Ps: lodash.isPlainObject逻辑与上述代码基本一致  
同样Redux的timdorr提的PR
