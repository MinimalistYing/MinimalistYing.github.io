import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {
	HashRouter as Router,
	Route,
	Link,
	Switch
} from 'react-router-dom'
import Loadable from 'react-loadable'

import {
	Header,
	Resume,
} from './components'

import './less/main.less'

const Loading = () => <div>Loading...</div>

const Blog = Loadable({
	loader: () => import('./components/Blog'),
	loading: Loading
})

const Memos = Loadable({
	loader: () => import('./components/Memos'),
	loading: Loading
})

const App = () => (
	<div>
		<Header />
		<Resume />
		<Switch>
			<Route exact path="/" component={Blog} />
			<Route exact path="/memo" component={Memos} />
		</Switch>
	</div>
)

ReactDOM.render(
	<Router>
		<App />
	</Router>,
	document.getElementById('app')
)