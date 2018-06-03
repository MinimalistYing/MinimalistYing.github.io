export default [{
	date: "2017/10/13",
	content: "React组件中的HTML标签必须闭合，否则会编译报错，例如 `<img>` 必须写作 `<img/>`"
}, {
	date: "2017/10/14",
	content: "如果确定一个Component再初始化后不需要重新render，可以在组件中声明 `shouldComponentUpdate (nextProps, nextState) {return false;}` 这会使React跳过对该组件是否需要重绘的检查，提升性能。还有一种情况下，如果你希望只有在组件的部分属性发生变化时才检查，可以通过在上述方法中比较 `nextProps` 和 `nextState` 中的指定值是否发生变化来实现。还可以通过继承React提供的 `React.PureComponent` 来方便的实现上述需求，这个方法的缺陷是只会进行浅比较，如果 `props.obj` 中存储的是一个对象或者数组等就会失效"
}, {
	date: "2017/10/19",
	content: "关于React中的Event Handlers传参数有一下俩种方式 `<button onClick={(e) => this.func(id, e)}>click</button>` 或者 `<button onClick={this.func.bind(this, id)}>click</button>` 第二种方式下的 `e` 会默认作为最后一个参数传递"
}, {
	date: "2017/10/30",
	content: "使用React-Router(3.x版本 其它版本估计也一样)，如果在 `<Router history={xxx}>` 上不配置 `history` 会报错 `Uncaught TypeError: Cannot read property 'getCurrentLocation' of undefined` 所以这个属性是SPA必配？"
}, {
	date: "2017/10/31",
	content: "关于React-Router中 `browserHisory` 和 `hashHistory` 的区别，前者的URL类似 `xx/xx` 后者是 `/#/xx` 由于HTTP协议的约定，URL中 `#` 后作为片段(frag)不会随请求发送至后台，所以不需要服务器进行特殊配置，而前者是借助浏览器下的 `history` API实现，在IE8/9下会导致跳页时Full Load，并且需要服务器配置接受所有请求都返回 `index.html` 。优点时使得站点有清晰干净的URL，并且服务器端渲染只能通过这种方式实现，固推荐使用 `browserHistory`"
}, {
	date: "2017/11/2",
	content: "如果希望在React组件内部进行路由、页面跳转，可以借助React-Router提供的 `withRouter(comp)` 之后便可在组件内部通过 `this.props.router` 来进行跳转。但有时候我们希望在组件外部来跳转，这就需要借助history来实现 ```import {browserHistory} from 'react-router'  browserHistory.goBack()  browserHistory.push()```"
}, {
	date: "2017/11/3",
	content: "React-Router采用动态路由的形式时页面报错 `The root route must render a single element` 可能是因为React组件是采用ES6的 `export default` 导出，而React-Router是采用CommonJS来 `require` 所以需要在导出的组件后加上 `.default` 类似 `require('components/Comp')).default`"
}]