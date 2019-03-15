# Redux 从入门到放弃

## 基本概念
当我们通过各类MVVM框架(React / Vue / Angular)开发复杂的单页应用(SPA)时  
随之而来碰到的问题是对应用中各种状态的管理  
每个组件都有各自的状态，当任意一个组件的状态发生变更，同时也可能需要触发另一个组件状态的变更  
当这种耦合关系越来越多的时候，我们会发现很难去寻找一个状态发生变更的原由  
并且当组件层级过深时，一层层的在组件间传递 props 也显得颇为繁琐  
Redux 的出现给开发者提供了一种更优雅的管理前端应用状态的解决方案  
当然相应的代价是需要引入一些冗余的语法( boilerplate )  
Redux 的核心是以下三个原则:  
* Single source of truth: 每个 Redux App 应该只有一个全局唯一的 Store
* State is read-only: Store 中存储的状态只能通过 Dispatch Action 来进行修改  
这样通过一些工具开发者可以很清楚的看到状态发生变更的时机以及每次所发生的改变  
甚至进行 Time Travel 来回到某个 Action 执行前的状态  
亦或是再次重新提交这个 Action 来观察其行为对应用的影响  
* Changes are made with pure functions: Reducer 是 Pure Function  

### Actions
不同于直接去修改应用的状态，例如 React 中的 `this.setState()`  
Redux 推崇通过 Dispacth Action 来修改状态  
Action 是一个携带了操作类型以及具体数据的简单对象( Plain Object )  
```js
const action = {
	// 操作类型 用于描述该次操作的用意
	// 通常由下划线分隔的大写字符组成
	// 当有很多 action 时建议将 type 提取成常量放到单独文件维护
	type: 'ADD_PEOPLE',
	// 具体操作的数据
	people: {
		name: 'a'
	}
}
```
以上 Action 中的数据是固定的，可以实现一个 ActionCreator 来根据参数动态的生成 Action  
```js
const actionCreator = people => ({
	type: 'ADD_PEOPLE',
	people
})
```
注意最终还是需要通过 `store.dispatch(action)` 将 Action 派发至 Reducer 中才能进行应用状态的变更  

### Reducer
Reducer 用于定义如何根据收到的不同 Action 去改变应用的状态  
Reducer 应该是一个 Pure Function , 意味着不应该在其中进行由副作用的操作  
并且当入参相同时其返回值应该总是相同的  
```js
// 注意需要给我们的应用设置一个初始化的 initalState
// 如果未指定 Redux 会开发环境下给出警告
function reducer(state = initalState, action) {
	switch(action.type) {
		case 'ADD_PEOPLE':
			return { ...state, ...{ people: action.people } }
		// 在遇到未知的 Action 时需要将原先的 state 直接返回
		default:
			return state
	}
}
```

### Store
每一个应用都只能有一个唯一的 Store  
通过 `createStore(reducers)` 来生成  
用于维护应用的所有 State ，以及提供一些静态方法用于改变、获取当前状态  
```js
store.getState() // 获取当前状态
store.dispatch(action) // 提交action来改变当前状态
const unsubscribe = store.subscribe(listener) // 监听事件
unsubscribe() // 取消监听
```

## 进阶以及源码(v4.0.0)
为了看起来更加精简，本文仅仅会对一些核心代码进行分析  
所以展示的只是不完整的代码片段，例如一些校验性质的代码就会被省略

### Middleware
Redux 的中间件使开发者可以在每次 `dispatch(action)` 前后加上一些特定的逻辑  
例如 logging/routing 等，中间件的写法如下  
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

### compose.js
在 Redux 的 applyMiddleware 中会用到，函数式编程中常见  
可以将传入的函数从右至左依次执行  
并且每个函数执行的结果会作为下一个函数的参数  
例如 `compose(a, b, c)(arg)` 执行起来同 `a(b(c(arg)))`
```js
export function compose(...funcs) {
	// 如果没有传入任何参数 则直接返回一个会将第一个参数返回的函数
	if (funcs.length === 0) {
		return arg => arg
	}
	
	// 如果参数只有一个函数则直接将该函数返回
	if (funcs.lenth === 1) {
		return funcs[0]
	}
	
	// 关于 Array.prototype.reduce 
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
	return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

----------- 下面都是分析  --------------

// 我们来试试 funcs.reduce 是如何来实现逻辑的
const first = () => console.log(1)
const second = () => console.log(2)
const third = () => console.log(3)
const funcs = [first, second, third]

// 分解开来看
// 第一次 reduce 相当于
// (first, second) => (...args) => first(second(...args))
// 其返回结果是
// (...args) => first(second(...args))
// 第二次 reduce 执行时的 accumulator 及第一次的返回结果
// 所以 (accumulator, third) => (...args) => accumulator(third(...args))
// 返回结果是 
// (...args) => accumulator(third(...args))
// 将 accumulator 替换后就相当于
// (...args) => first(second(third(...args))
const re = funcs.reduce((a, b) => (...args) => a(b(...args)))

// 上述代码中有一个地方要理解一下
// const test = (...args) => f(...args)
// 在参数中的...其实起到的是收集的作用，会将我们调用时传入的所有参数放到args这个数组中
// 而在 f(...args) 中的...起到的是解构的作用
// 又会将 args 数组中的所有元素依次作为参数传到f这个函数中
// 假设我们 test(1, 2, 3) 这样调用则其返回结果其实就是 f(1, 2, 3)
// 所以这种做法其实就是在我们不确定一个函数入参个数的情况下
// 将所有入参原封不动的按照原有顺序传入到调用函数中
// 按照老的方式其实就是借助 arguments 来实现
// es6
const test = (...args) => f(...args)
// Babel 编译后
var test = function test() {
	return f.apply(undefined, arguments)
}

// 从上述分析可以得出 re 其实就等同于
// (...args) => first(second(third(...args))
// 当我们调用 re() 就等同于
// first(second(third())
// 所以输出是 3 2 1
re() // 3 2 1

// 通过对传入函数的特殊处理 可以使这个过程变为正序
// Redux 的 middleWare 就是借助这种原理
const a = next => arg => { console.log(arg); next('b'); }
const b = next => arg => { console.log(arg); next('c'); }
const c = next => arg => { console.log(arg); next('d'); }
const d = arg => console.log(arg)

// 'a' 'b' 'c' 'd'
compose(a,b,c)(d)('a')
// 继续分解来看一下 首先是compose(a, b, c)
// 从上述分析得出的结论来看也就是等同于
// (...args) => a(b(c(...args)))
// 然后是compose(a,b,c)(d) 所以入参为函数d
// 也就是等同于a(b(c(d)))
// 第一步c(d) 返回 re1 = arg => {console.log(arg); d('d')}
// 第二步b(c(d)) 也就是b(re1) 返回 re2 = arg => { console.log(arg); re1('c'); }
// 第三步a(b(c(d))) 也就是a(re2) 返回 re3 = arg => { console.log(arg); re2('b'); }
// 所以compose(a,b,c)(d) 返回的就是 arg => { console.log(arg); re2('b'); }
// 最后一步compose(a,b,c)(d)('a') 相当于
// console.log('a'); re2('b')
// 再把所有的结果展开
// console.log('a'); console.log('b'); console.log('c'); console.log('d');
```

### applyMiddleware
对外提供应用中间件的接口
```js
export default function applyMiddleware(...middlewares) {
	// 注意 applyMiddleware 是一个高阶函数
	// 返回值是一个入参为 createStore 的函数
	return createStore => (...args) => {
		// 当需运用中间件时 createStore 在此处真正执行
		const store = createStore(...args)
		
		// 只提供给中间件有限的 API 而不是全部 store
		const middlewareAPI = {
			getState: store.getState,
			dispatch: (...args) => dispatch(...args)
		}
		// 要注意此时如果在 middleware 中执行 middlewareAPI.dispatch() 会抛出错误
		// 由于 Redux 规定 middleware 形如 store => next => action => {} 的函数
		// 这样处理过后在 chain 中存放的便是形如 next => action => {} 的函数
		const chain = middlewares.map(middleware => middleware(middlewareAPI))
		// 这里的 dispatch 是已经实现了中间件逻辑后的 dispatch 方法
		dispatch = compose(...chain)(store.dispatch)
		
		// 这里利用了解构会去重的特性
		// 会将 store.dispatch 覆盖为包含中间件逻辑的新 dispatch
		return {
			...store,
			dispatch
		}
	}
}
```

### utils/isPlainObject.js
该工具函数用于判断一个 Action 是不是 Plain Object    
所谓的 Plain Object 指的是直接通过 `{}` 或者 `new Object()` 生成，原型链上并没有其它对象的 Object
```js
// 大体上就相当于 Object.getPrototypeOf(obj) === Object.prototype
export function isPlainObject(obj) {
	// 如果对象都不是当然也不是PlainObject
	// 这里注意的是 obj === null 这个判断
	// 因为在Js中 typeof null === 'object'
	if (typeof obj !== 'object' || obj === null) return false
	
	// lodash 中的 isPlainObject 多了这个逻辑
	// 主要考虑到这个特殊情况 const o = Object.create(null)
	// 此处的o应该也满足条件 isPlainObject(o) // => true
	if (Object.getPrototypeOf(obj) === null) {
		return true
	}
	
	let proto = obj
	// 因为 Object.getPrototypeOf(Object.prototype) === null
	// 所以当循环结束时 proto 指向的其实就是Object.prototype
	// 也就是说此时的 proto === Object.prototype
	while (Object.getPrototypeOf(proto) !== null) {
		proto = Object.getPrototypeOf(proto)
	}
	
	// 如果传入对象的 prototype 与 Object.prototype 一致
	// 则认为该对象是 Plain Object
	// 所以最终的判断逻辑其实与 obj.__proto__ === Object.prototype 类似
	// 上面的代码更多的是在考虑 edge case
	// 至于这里为什么不使用 Object.getPrototypeOf(obj) === Object.prototype
	// 可以戳这里 https://github.com/reduxjs/redux/pull/2599#issuecomment-342849867
	return Object.getPrototypeOf(obj) === proto
}
```
Ps: `lodash.isPlainObject` 逻辑与上述代码基本一致  
同样是 Redux 的开发者 *timdorr* 提的 PR

### index.js
```js
// ...

// 建立一个函数名为 isCrushed 的空函数
function isCrushed() {}

// 如果当前的环境不是生成环境但采用了压缩过后的代码则提示开发者
// 因为压缩混淆后的代码会将函数改变为类似 function f() {} 以减小代码体积
if (process.env.NODE_ENV !== 'production' && 
	typeof isCrushed.name === 'string' &&
	isCrushed.name !== 'isCrushed'
) {
	warning('...')
}

// 以下为 Redux 所有对外提供的 API
export {
	createStore,
	combineReducers,
	bindActionCreators,
	applyMiddleware,
	compose,
	__DO_NOT_USE__ActionTypes
}
```

### createStore.js
Redux 应用的主入口  
```js
// reducer 必传 通常来讲是我们通过 combineReducers 将所有 ruducer 集成到一起后的主函数
// preloaderState 可选 可以传入的应用初始状态
// enhancer 可选 也就是 applyMiddleware() 的返回结果
export default function createStore(reducer, preloadedState, enhancer) {
	// 由于 preloadedState 参数是可选的 所以这里考虑的是这么一种情况
	// createStore(reducer, applyMiddleware())
	// 这样在不传入 preloadedState 时就不用像 createStore(reducer, null, applyMiddleware()) 这样调用
	if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
		enhancer = preloadedState
		preloadedState = undefined
	}
	
	// 有传入 enhancer 也就是有使用中间件(applyMiddleware)
	if (typeof enhancer !== 'undefined') {		
		// 有使用中间件的话 需要在 applyMiddleware 去 createStore
		// applyMiddleware() 返回的是一个形如 createStore => (...args) => {} 的函数
		// 所以这里会对enhancer(cerateStore)返回的结果再次传入参数(reducer, preloaderState)调用
		return enhancer(createStore)(reducer, preloaderState)
	}
	
	// 利用闭包存储当前的 Reducer
	// 这样就稍后才可通过 replaceReducer() 方法替换掉当前使用的 Reducer
	let currentReducer = reducer
	
	// 同上 整个 Redux 应用的状态树都是利用闭包存储的
	let currentState = preloadedState
	
	// 这里要注意 多存了一份当前监听事件函数的备份
	let currentListeners = []
	let nextListeners = currentListeners
	
	// 用于标识当前是否正在执行 dispatch() 操作
	let isDispatching = false
	
	// 确保 nextListeners 存的是 currentListeners 的备份 而不是引用
	function ensureCanMutateNextListeners() {
		if (nextListeners === currentListeners) {
			nextListeners = currentListeners.slice()
		}
	}
	
	// 简单的把当前闭包所存储的应用状态返回出去
	function getState() {
		// 正在执行 dispatch 操作时不能获取当前状态
		// 因为当前状态可能会被正在执行的 dispatch() 操作改变
		if (isDispatching) {
			throw new Error('...')
		}
		
		return currentState
	}
	
	// 注册监听事件 在每次 dispath 时都会调用所有注册过的函数
	function subscribe(listener) {
		// 正在执行dispatch操作时不允许新注册监听事件
		if (isDispatching) {
			throw new Error('...')
		}
		
		// 这里同样利用了闭包
		// 每次调用都会有独立的 isSubscribed 状态
		// 与每个 listener 一一对应
		let isSubscribed = true
		
		ensureCanMutateNextListeners()
		nextListeners.push(listener)
		
		return function unsubscribe(){
			// 避免重复取消监听 例如
			// const off = store.subscribe(...)
			// off()
			// off()
			if (!isSubscribed) {
				return
			}
			
			// 正在执行 dispatch 操作时不允许取消监听
			if (isDispatching) {
				throw new Error('...')
			}
			
			// 代表这个 listener 已经取消监听了
			isSubscribed = false
			
			ensureCanMutateNextListeners()
			// 这里也利用了闭包 先找到当前闭包存储的入参 listerner 在数组中的下标
			const index = nextListeners.indexOf(listener)
			// 移除数组中对应下标存储的元素
			nextListeners.splice(index, 1)
		}
	}
	
	function dispatch(action) {
		// 阻止开发者在 reducer 中去调用 dispatch
		if (isDispatching) {
			throw new Error('...')
		}
		
		try {
			isDispatching = true
			// currentReducer 就是当前 Redux 正在使用的 Reducer
			// 将当前状态树和 action 传入 返回经 reducer 处理过后的新状态树
			currentState = currentReducer(currentState, action)
		} finally {
			// 无论 reducer 处理过程中是否出错 都需要更改 flag
			// 代表本次 dispatch 操作结束 否则接下来 redux 就没法用了
			isDispatching = false
		}
		
		// 这里要注意执行顺序
		// 每次 dispatch 都会将当前的 currentListeners 指向 nextListeners
		// 所以每次执行的其实都是最新的 nextListeners 当中存储的的监听事件
		// 这里就可以理解 ensureCanMutateNextListeners() 的用处
		// 每次新增监听或取消监听时都要确保 nextListeners 是 currentListener 的拷贝
		// 这样保证在 dispatch 过程中的 currentListerner 不会发生变化
		// 例如如果我们在一个 listener 函数中去新 subscribe 或者 unsubscribe
		// 都不会立马生效 而是只有等到下一次 dispatch 才会生效
		const listeners = (currentListeners = nextListeners)
		for (let i = 0; i < listeners.length; i++) {
			// 注意这里的用法 并没有直接像 listeners[i]() 这样调用
			// 因为这样的话 listener 中的 this 会指向 listeners 而不是 window
			const listener = listeners[i]
			listener()
		}
		
		// 将传入的 action 原封不动返回
		// 感觉基本来说不会用到这个函数的返回值
		return action
	}
	
	// 替换当前正在使用的 Reducer
	function replaceReducer(nextReducer) {	
		// 直接将闭包的存储指向新的 Reducer
		currentReducer = nextReducer
		// dispatch 一个 REPLACE Action 来重新生成新的状态树
		dispatch({ type: ActionTypes.REPLACE })
	}
	
	// dispatch 一个 INIT Action 初始化生成Redux的状态树
	dispatch({ type: ActionTypes.INIT })
	
	// 对外主要就提供了四个 API
	return {
		dispatch,
		subscribe,
		getState,
		replaceReducer,
		[$$observable]: observable // 私有的 用于测试 这里不具体展开
	}
}
```

### combineReducer.js
由于在大型应用中我们需要管理一个复杂的状态树  
如果将所有的 Action 处理逻辑写在同一个 Reducer 中会很难维护  
所以大多数情况下我们的项目中会有很多个不同的 Reducer 文件  
而 Redux 的 `createStore(reducer)` 只接受一个 RootReducer 作为参数  
所以这个时候就需要借助 Redux 提供的这个工具方法将所有的子 Reducer 合为最终的 RootReducer
其主要作用如下  
```js
// 应用的状态树
const state = {
	a: '',
	b: ''
}

const reducerA = (a, action) => {}
const reducerB = (b, action) => {}
// 自己手动来生成 RootReducer
const rootReducer = (state, action) => {
	return {
		a: reducerA(state.a, action),
		b: reducerB(state.b, action)
	}
}
// 借助 combineReducer
// 入参中的 key 需要与 state 中的 key 相对应
// 子 Reducer 的函数名可以任意 并无影响
const rootReducer = combineReducer({
	a: reducerA,
	b: reducerB
})
```
下面看看源码
```js
// ...

// 将多个子 reducer 组合返回一个 root reducer 函数
export default function combineReducers(reducers) {
	// 拿到入参对象的所有 key
	const reducerKeys = Object.keys(reducers)
	const finalReducers = {}
	
	for (let i = 0; i < reducerKeys.length; i++) {
		const key = reducerKeys[i]
	
		// 确保 fianalReducers 中的每个 value 都是一个函数
		if (typeof reducers[key] === 'function') {
			finalReducers[key] = reducers[key]
		}
	}
	const finalReducerKeys = Object.keys(finalReducers)
		
	return function combination(state = {}, action) {
		let hasChanged = false
		const nextState = {}
		for (let i = 0; i < finalReducerKeys.length; i++) {
			const key = finalReducerKeys[i]
			const reducer = finalReducers[key]
			const previouStateForKey = state[key]
			const nextStateForKey = reducer(previousStateForKey, action)
			// Reducer 处理过后的状态不能返回为空
			if (typeof nextStateForKey === 'undefined') {
				throw new Error('...')
			}
			nextState[key] = nextStateForKey
			// 判断经 Reducer 处理后的状态前后是否发生变化
			hasChanged = hasChanged || nextStateForKey !== previousStateForKey
		}
		// 注意 对于 Redux 而言 整个状态树中只要有一处发生变化 则视为其有过变化
		return hasChanged ? nextState : state
	}
}
```

### bindActionCreators.js
在 Redux 中我们需要先生成 `Action` 然后再将其 `dispatch` 至 `Reducer` 来触发状态的改变  
如果你觉得分俩步操作过于繁琐就可以通过 `bindActionCreators` 将这俩步操作绑定在一起  
```js
function bindActionCreator(actionCreator, dispatch) {
	// 返回一个函数 执行会先 Create Action  
	// 然后 dispatch 这个生成的 Action
	return function () {
		dispatch(actionCreator.apply(this, arguments))
	}
}

export default bindActionCreators(actionCreators, dispatch) {
	// 传入单个 Creator
	// 直接返回绑定后的 Creator
	if (typeof actionCreators === 'function') {
		return bindActionCreator(actionCreators, dispatch)
	}
	
	const keys = Object.keys(actionCreators)
	// 用于存储绑定后的 Creator
	const boundActionCreators = {}
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i]
		const actionCreator = actionCreators[key]
		if (typeof actionCreator === 'function') {
			// 依次绑定每一个 Creator
			boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
		}
	}
	// 将绑定后的结果返回
	return boundActionCreators
}
```
