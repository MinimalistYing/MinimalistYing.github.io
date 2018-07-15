import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {
	HashRouter as Router,
	Route,
	Link
} from 'react-router-dom'

import {
	Header,
	Resume,
	Memos,
	MyBlog
} from './components'

import './less/main.less'

const App = () => (
	<div>
		<Header />
		<Resume />
		<div>
			<Route exact path="/" component={MyBlog} />
			<Route exact path="/memo" component={Memos} />
		</div>
	</div>
)

ReactDOM.render(
	<Router>
		<App />
	</Router>,
	document.getElementById('app')
)