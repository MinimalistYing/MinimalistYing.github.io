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

import './less/main.less'

const App = () => (
	<div>
		<Header />
		<main>
			<Resume />
		</main>
	</div>
)

ReactDOM.render(
	<Router>
		<App />
	</Router>,
	document.getElementById('app')
)