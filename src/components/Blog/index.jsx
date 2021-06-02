import React from 'react'
import Scroll from 'iscroll'
import {
	withRouter
} from 'react-router-dom'
import Markdown from '@/Markdown'
import blogs, { category } from '@blog'

import './style.less'

class MyBlog extends React.Component {
	componentDidMount () {
		window.scrollTo(0, 0)
	}

	render() {
		const cat = category.find(({ key }) => key === this.props.blogKey)
		console.log(cat)

		const index = this.props.content.indexOf('\n')
		const title = this.props.content.slice(2, index)
		const content = this.props.content.slice(index + 1)

		return (
			<div className='blogs'>
				<div className='blog'>
					<figure>
						<img className="blog-img" src={cat.img} />
						<figcaption>
							<div className="blog-name">{title}</div>
							<div className="blog-date">{cat.date}</div>
							<div className="tag-box">
								{cat.tags.map(tag => <div key={tag} className="tag">{tag}</div>)}
							</div>
						</figcaption>
					</figure>
					
					<div className="md-box">
						<Markdown data={content} />
					</div>
				</div>
			</div>
		)
	}
}

export default withRouter(MyBlog)
