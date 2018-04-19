import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {
	BrowserRouter as Router,
	Route,
	Link
} from 'react-router-dom'

import Header from './components/Header/index.jsx'
import Resume from './components/Resume/index.jsx'
import Memos from './components/Memos/index.jsx'
import Blog from './components/Blog/index.jsx'

import './less/main.less'

const App = () => (
	<div>
		<Header />
		<main>
			<Resume />
			<Route exact path="/" component={Blog} />
			<Route exact path="/memo" component={Memos} />
		</main>
	</div>
)

ReactDOM.render(
	<Router>
		<App />
	</Router>,
	document.getElementById('app')
)