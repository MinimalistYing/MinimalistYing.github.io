import 'babel-polyfill'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import {
	BrowserRouter as Router,
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
				<Route exact path="/index.html" component={Blog} />
				<Route exact path="/memo.html" component={Memos} />
				<Route exact path="/messagedemo.html" component={MessageDemo} />
			</Switch>
		</Suspense>
	</div>
)

// your code
ReactDOM.render(
	<Router>
		<App />
	</Router>,
	document.getElementById('app')
)

