# Redux从入门到放弃

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

## 进阶以及源码(v4.0.0)

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

### index.js
```js
import createStore from './createStore'
import combineReducers from './combineReducers'
import bindActionCreators from './bindActionCreators'
import applyMiddleware from './applyMiddleware'
import compose from './compose'
import warning from './utils/warning'
import __DO_NOT_USE__ActionTypes from './utils/actionTypes'

// 建立一个函数名为isCrushed的空函数
function isCrushed() {}

// 如果当前的环境不是生成环境但采用了压缩过后的代码则提示开发者
// 因为压缩混淆后的代码会将函数改变为类似 function f() {} 以减小代码体积
if (process.env.NODE_ENV !== 'production' && 
	typeof isCrushed.name === 'string' &&
	isCrushed.name !== 'isCrushed'
) {
	warning('You are currently using minified code outside of NODE_ENV === "production". ' +
      'This means that you are running a slower development build of Redux. ' +
      'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' +
      'or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) ' +
      'to ensure you have the correct code for your production build.')
}

// 以下为Redux所有对外提供的API
export {
	createStore,
	combineReducers,
	bindActionCreators,
	applyMiddleware,
	compose,
	__DO_NOT_USE__ActionTypes
}
```

### compose.js
在Redux的applyMiddleware中会用到，函数式编程中常间  
可以将传入的函数从右至左依次执行  
并且每个函数执行的结果会作为下一个函数的参数
类似`compose(a, b, c)(arg)`执行起来同`a(b(c(arg)))`
```js
export function compose(...funcs) {
	// 如果没有传入函数则直接返回一个会将第一个参数返回出来的函数
	if (funcs.length === 0) {
		return arg => arg
	}
	
	// 如果只有一个函数则直接将该函数返回
	if (funcs.lenth === 1) {
		return funcs[0]
	}
	
	// 关于Array.prototype.reduce 
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
	return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

----------- 下面都是分析  --------------

// 我们来试试funcs.reduce是如何来实现逻辑的
const first = () => console.log(1)
const second = () => console.log(2)
const third = () => console.log(3)
const funcs = [first, second, third]

// 分解开来看
// 第一次reduce相当于
// (first, second) => (...args) => first(second(...args))
// 其返回结果是
// (...args) => first(second(...args))
// 第二次reduce执行时的accumulator及第一次的返回结果
// 所以 (accumulator, third) => (...args) => accumulator(third(...args))
// 返回结果是 
// (...args) => accumulator(third(...args))
// 相当于
// (...args) => first(second(third(...args))
consr re = funcs.reduce((a, b) => (...args) => a(b(...args)))

// 上述代码中有一个地方要理解一下
// const test = (...args) => f(...args)
// 在参数中的...其实起到的是收集的作用，会将我们调用时传入的所有参数放到args这个数组中
// 而在func(...args)中的...起到的是解构的作用
// 又会将args数组中的所有元素依次作为参数传到func这个函数中
// 假设我们test(1, 2, 3)这样调用则其返回结果其实就是func(1, 2, 3)
// 所以这种做法其实就是在我们不确定一个函数入参个数的情况下
// 将所有入参原封不动的按照原有顺序传入到调用函数中
// 按照老的方式其实就是借助arguments来实现
// es6
const test =(...args) => f(...args)
// Babel编译后的等同代码
var test = function test() {
	return f.apply(undefined, arguments)
}

// 从上述分析可以得出 re其实就等同于
// (...args) => first(second(third(...args))
// 当我们调用re()就等同于
// first(second(third())
// 所以输出是 3 2 1
re() // 3 2 1

// 通过对传入函数的特殊处理 可以使这个过程变为正序
// Redux的middleWare就是借助这种原理
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
// 第三步a(b(c(d))) 也牛市a(re2) 返回 re3 = arg => { console.log(arg); re2('b'); }
// 所以compose(a,b,c)(d) 返回的就是 arg => { console.log(arg); re2('b'); }
// 最后一步compose(a,b,c)(d)('a') 相当于
// console.log('a'); re2('b')
// 再把所有的re展开 其实就是
// console.log('a'); console.log('b'); console.log('c'); console.log('d');
```

### applyMiddleware
对外提供引入中间件的接口
```js
export default function applyMiddleware(...middlewares) {
	// 注意applyMiddleware是一个高阶函数
	// 返回值是一个入参为createStore的函数
	return createStore => (...args) => {
		// 当需运用中间件时 createStore在此处真正执行
		const store = createStore(...args)
		
		// 如果middleware在执行自己的逻辑过程中调用dispatch则抛出错误
		let dispatch = () => { throw new Error('...') }
		
		// 只提供给中间件有限的API而不是全部store
		const middlewareAPI = {
			getState: store.getState,
			dispatch: (...args) => dispatch(...args)
		}
		// 要注意此时如果在middleware中执行 middlewareAPI.dispatch() 会抛出错误
		// 由于Redux规定middleware形如 store => next => action => {} 的函数
		// 这样处理过后在chain中存放的便是形如 next => action => {} 的函数
		const chain = middlewares.map(middleware => middleware(middlewareAPI))
		// 这里的dispatch是已经实现了中间件逻辑后的dispatch方法
		dispatch = compose(...chain)(store.dispatch)
		
		// 这里利用了解构会去重的特性
		// 会将store.dispatch替换为包含中间件逻辑的新dispatch
		return {
			...store,
			dispatch
		}
	}
}
```

### createStore.js
Redux应用的主入口文件  
```js
// reducer 必传 通常来讲是我们通过combineReducers将所有ruducer集成到一起后的主函数
// preloaderState 可选 可以传入的应用初始状态
// enhancer 可选 也就是applyMiddleware()的返回结果
export default function createStore(reducer, preloadedState, enhancer) {
	// 由于初始化状态是可选的 所以这里考虑的是这么一种情况
	// createStore(reducer, applyMiddleware())
	// 这样在不传入初始状态时就不用像createStore(reducer, null, applyMiddleware())这样调用
	if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
		enhancer = preloadedState
		preloadedState = undefined
	}
	
	// 有传入enhancer 也就是有使用中间件
	if (typeof enhancer !== 'undefined') {
		// applyMiddleware()返回的应该是一个函数 否则需要报错
		if (typeof enhancer !== 'function') {
			throw new Error('Expected the enhancer to be a function.')
		}
		
		// 有使用中间件的话 需要在applyMiddleware去createStore
		return enhancer(createStore)(reducer, preloaderState)
	}
	
	// reducer也必须为函数
	if (typeof reducer !== 'function') {
		throw new Error('Expected the reducer to be a function.')
	}
	
	// 利用闭包存储当前的Reducer
	// 这样就稍后才可通过replaceReducer()方法替换掉当前使用的Reducer
	let currentReducer = reducer
	
	// 同上 整个Redux应用的状态树都是利用闭包存储的
	let currentState = preloadedState
	
	// 这里要注意 多存了一份当前监听事件函数的备份
	let currentListeners = []
	let nextListeners = currentListeners
	
	// 用于标识当前是否正在执行dispatch()操作
	let isDispatching = false
	
	// 确保nextListeners存的是currentListeners的备份 而不是引用
	function ensureCanMutateNextListeners() {
		if (nextListeners === currentListeners) {
			nextListeners = currentListeners.slice()
		}
	}
	
	// 简单的把当前闭包所存储的应用状态返回出去
	function getState() {
		// 正在执行dispatch操作时不能获取当前状态
		// 因为当前状态可能会被正在执行的dispatch()操作改变
		if (isDispatching) {
			throw new Error('...')
		}
		
		return currentState
	}
	
	// 注册监听事件 在每次dispath时都会调用所有注册过的函数
	function subscribe(listener) {
		// 注册的listener只能是函数
		if (typeof listener !== 'undefined') {
			throw new Error('...')
		}
	
		// 正在执行dispatch操作时不允许新注册监听事件
		if (isDispatching) {
			throw new Error('...')
		}
		
		// 这里同样利用了闭包
		// 每次调用都会有独立的isSubscribed状态
		// 与每个listener一一对应
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
			
			// 正在执行dispatch操作时不允许取消监听
			if (isDispatching) {
				throw new Error('...')
			}
			
			// 代表这个listener已经取消监听了
			isSubscribed = false
			
			ensureCanMutateNextListeners()
			// 这里也利用了闭包 先找到当前闭包存储的入参listerner在数组中的下标
			const index = nextListeners.indexOf(listener)
			// 移除数组中对应下标存储的元素
			nextListeners.splice(index, 1)
		}
	}
	
	
	function dispatch(action) {
		// 在Redux中Action只能为plain object
		if (!isPlainObject(action)) {
			throw new Error('...')
		}
		
		// Action的type不能为空
		// 通常来说type都应该是一个用于描述当前行为的常量字符串
		// 不知道这里为什么不限制type只能为string
		if (typeof action.type === 'undefined') {
			throw new Error('...')
		}
		
		// 阻止开发者在reducer中去调用dispatch
		if (isDispatching) {
			throw new Error('...')
		}
		
		try {
			isDispatching = true
			// currentReducer就是当前Redux正在使用的Reducer
			// 将当前状态树和action传入 返回经reducer处理过后的新状态树
			currentState = currentReducer(currentState, action)
		} finally {
			// 无论reducer处理过程中是否出错 都需要更改flag
			// 代表本次dispatch操作结束 否则接下来redux就没法用了
			isDispatching = false
		}
		
		// 这里要注意执行顺序
		// 每次dispatch都会将当前的currentListeners 指向 nextListeners
		// 所以每次执行的其实都是最新的nextListeners当中存储的的监听事件
		// 这里就可以理解ensureCanMutateNextListeners()的用处
		// 每次新增监听或取消监听时都要确保nextListeners是currentListener的拷贝
		// 这样保证在dispatch过程中的currentListerner不会发生变化
		// 例如如果我们在一个listener函数中去新subscribe或者unsubscribe
		// 都不会立马生效 而是只有等到下一次dispatch才会生效
		const listeners = (currentListeners = nextListeners)
		for (let i = 0; i < listeners.length; i++) {
			// 注意这里的用法 并没有直接像 listeners[i]()这样调用
			// 因为这样的话listener中的this会指向listeners而不是window
			const listener = listeners[i]
			listener()
		}
		
		// 将传入的action原封不动返回
		// 感觉基本来说不会用到这个函数的返回值
		return action
	}
	
	// 替换当前正在使用的Reducer
	function replaceReducer(nextReducer) {
		// Reducer必须是函数
		if (typeof nextReducer !== 'function') {
			throw new Error('...')
		}
		
		// 直接将闭包的存储指向新的Reducer
		currentReducer = nextReducer
		// dispatch一个REPLACE Action 来重新生成新的状态树
		dispatch({ type: ActionTypes.REPLACE })
	}
	
	// dispatch一个INIT Action 初始化生成Redux的状态树
	dispatch({ type: ActionTypes.INIT })
	
	// 对外主要就提供了四个API
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
如果将所有的Action处理逻辑写入一个Reducer中会很难维护  
所以基本可以确定的是我们的项目中会有很多Reducer  
而Redux的`createStore(reducer)`只接受一个RootReducer作为参数  
所以这个时候就需要借助Redux提供的这个工具方法将所有的子Reducer合为最终的RootReducer
其主要作用如下  
```js
// 应用的状态树
const state = {
	a: '',
	b: ''
}

const reducerA = (a, action) => {}
const reducerB = (b, action) => {}
// 自己手动来生成RootReducer
const rootReducer = (state, action) => {
	return {
		a: reducerA(state.a, action),
		b: reducerB(state.b, action)
	}
}
// 借助combineReducer
// 入参中的key需要与state中的key相对应
// 子Reducer的函数名可以任意 并无影响
const rootReducer = combineReducer({
	a: reducerA,
	b: reducerB
})
```
下面看看源码
```js
import ActionTypes from './utils/actionTypes'
import warning from './utils/warning'
import isPlainObject from './utils/isPlainObject'

// 用于生成当有Reducer返回的state为undefined时的错误描述
function getUndefinedStateErrorMessage(key, action) {
	const actionType = action && action.type
	const actionDescription =
		(actionType && `action "${String(actionType)}"`)) || 'an action'
	return '...'
}

// 用于生成在入参的key与state中的key有不一致时生成错误描述
function getUnexpectedStateShapeWarningMessage() {}

// 判断传入的reducer是否都合规 否则抛出错误
function assertReducerShape(reducers) {
	Object.keys.(reducers).forEach(key => {
		const reducer = reducers[key]
		// 用初始化的Action去生成默认的state
		const initialState = reducer(undefined, { type: ActionTypes.INIT })
		// 如果有reducer没有提供默认的state则抛出错误
		// 所以如果即使当我们希望一个reducer默认不返回值时应该显示的返回null
		if (initialState === undefined) {
			throw new Error()
		}
		
		// 当传一个未知type的action到reducer中时
		// reducer也应该返回一个状态 通常来说是将传入的state 不错修改直接返回
		if (typeof reducer(undefined, {
			type: ActionTypes.PROBE_UNKNOWN_ACTION()
		}) === 'undefined') {
			throw new Error()
		}
	})
}

// 将多个子reducer组合返回一个root reducer函数
export default function combineReducers(reducers) {
	// 拿到入参对象的所有key
	const reducerKeys = Object.keys(reducers)
	const finalReducers = {}
	
	for (let i = 0; i < reducerKeys.length; i++) {
		const key = reducerKeys[i]
		
		// 只有在开发环境下进行警告提示
		if (process.env.NODE_ENV !== 'production') {
			// 不是很理解这个判断
			// 只有当入参对象的value中有undefined时才会警告
			if (typeof reducers[key] === 'undefined') {
				warning('...')
			}
			
			// 这一步会过滤掉入参中value不是函数的部分
			// 确保fianalReducers中的每个value都是一个函数
			if (typeof reducers[key] === 'function') {
				finalReducers[key] = reducers[key]
			}
		}
		
		if (typeof reducers[key] === 'function') {
			finalReducers[key] = reducers[key]
		}
		const finalReducerKeys = Object.keys(finalReducers)
	}
}
```
