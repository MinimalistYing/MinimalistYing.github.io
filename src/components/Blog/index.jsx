import React from 'react'
import Scroll from 'iscroll'
import {
	withRouter
} from 'react-router-dom'
import Markdown from '@/Markdown'
import blogs, { category } from '@blog'

import './style.less'

class MyBlog extends React.Component {
	constructor() {
		super()
		this.state = {
			categories: category.map(key => ({
				name: blogs[key].slice(2, blogs[key].indexOf('\n')),
				key
			})),
			showCategory: false
		}
	}

	componentDidMount() {
		if (window.innerWidth >= 1024) {
			setTimeout(() => {
				const scroll = new Scroll(document.getElementById('category'), {
					mouseWheel: true,
					scrollbars: true,
					fadeScrollbars: true
				})
				const pathname = window.location.pathname
				const id =pathname.slice(1, pathname.length- 5)
				scroll.scrollToElement(document.getElementById(id))
			})
		}
	}

	switch = key => {
		this.props.history.push(`${key}.html`)
	}

	render() {
		return (
			<div className='blogs'>
				<div className='blog'>
					<Markdown data={this.props.content} />
				</div>
				<div id="category" className={this.state.showCategory ? 'category-box show' : 'category-box'}>
					<ul className="blogs-category">
						{
							this.state.categories.map((item, index) => (
								<li
									id={item.key}
									key={item.key}
									className={this.props.history.location.pathname.endsWith(`${item.key}.html`) ? 'selected' : ''}
									onClick={() => this.switch(item.key)}
								>{item.name}</li>
							))
						}
					</ul>
				</div>
				<div className={this.state.showCategory ? 'category-toggle show' : 'category-toggle'} onClick={() => this.setState(prev => ({ showCategory: !prev.showCategory }))}></div>
			</div>
		)
	}
}

export default withRouter(MyBlog)
