import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {
	BrowserRouter as Router,
	Route,
	Link
} from 'react-router-dom'

import Header from './components/Header/index.jsx'

const App = () => (
	<div>
		<Header />
	</div>
)

ReactDOM.render(
	<Router>
		<App />
	</Router>,
	document.getElementById('app')
)