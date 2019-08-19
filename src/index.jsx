import 'babel-polyfill'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import {
	BrowserRouter as Router,
	Route,
	Link,
	Switch
} from 'react-router-dom'
import blogs, { category } from '@blog'

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
				<Route exact path="/" render={props => <Blog {...props} content={blogs[category[0]]} />} />
				<Route exact path="/index.html" render={props => <Blog {...props} content={blogs[category[0]]} />} />
				{
					Object.keys(blogs).map(key => <Route exact key={key} path={`/${key}.html`} render={props => <Blog {...props} content={blogs[key]} />} />)
				}
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

