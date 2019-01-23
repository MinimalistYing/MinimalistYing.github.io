import 'babel-polyfill'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import {
	HashRouter as Router,
	Route,
	Link,
	Switch
} from 'react-router-dom'

import {
	Header,
	Loading
} from './components'

import './less/main.less'

const Blog = React.lazy(() => import('./components/Blog'))
const Memos = React.lazy(() => import('./components/Memos'))
const MessageDemo = React.lazy(() => import('./components/VanillaAntdDemo'))

const App = () => (
	<div>
		<Header />
		<Suspense fallback={<Loading />}>
			<Switch>
				<Route exact path="/" component={Blog} />
				<Route exact path="/memo" component={Memos} />
				<Route exact path="/messagedemo" component={MessageDemo} />
			</Switch>
		</Suspense>
	</div>
)

ReactDOM.render(
	<Router>
		<App />
	</Router>,
	document.getElementById('app')
)