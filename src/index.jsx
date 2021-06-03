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
const Main = React.lazy(() => import('./components/Main'))
const MessageDemo = React.lazy(() => import('./components/VanillaAntdDemo'))
const Tools = React.lazy(() => import('./components/Tools'))
const Games = React.lazy(() => import('./components/Games'))

const App = () => (
	<div>
		<Header />
		<Suspense fallback={<Loading />}>
			<Switch>
				<Route exact path="/" component={Main} />
				<Route exact path="/index.html" component={Main} />
				{
					Object
						.keys(blogs)
						.map(key => <Route exact key={key} path={`/${key}.html`} render={props => <Blog {...props} content={blogs[key]} blogKey={key} />} />)
				}
				<Route exact path="/memo.html" component={Memos} />
				<Route exact path="/messagedemo.html" component={MessageDemo} />
				<Route exact path="/tools.html" component={Tools} />
				<Route exact path="/games.html" component={Games} />
				<Route path="*" component={Main}/>
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
