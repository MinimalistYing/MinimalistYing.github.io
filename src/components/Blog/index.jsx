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

	switch = key => {
		this.props.history.push(`${key}.html`)
	}

	render() {
		return (
			<div className='blogs'>
				<div className='blog'>
					<Markdown data={this.props.content} />
				</div>
				<div className={this.state.showCategory ? 'category-toggle show' : 'category-toggle'} onClick={() => this.setState(prev => ({ showCategory: !prev.showCategory }))}></div>
			</div>
		)
	}
}

export default withRouter(MyBlog)
