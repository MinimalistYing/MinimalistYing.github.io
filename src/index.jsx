import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {
	HashRouter as Router,
	Route,
	Link
} from 'react-router-dom'

import Header from './components/Header/index.jsx'
import Resume from './components/Resume/index.jsx'
import Memos from './components/Memos/index.jsx'
import MyBlog from './components/Blog/index.jsx'

import './less/main.less'

const App = () => (
	<div>
		<Header />
		<div>
			<Resume />
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