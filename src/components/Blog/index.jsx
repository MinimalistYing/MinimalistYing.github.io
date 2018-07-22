import React from 'react'
import Markdown from '@/Markdown'
import WebpackBaseConfig from '../../blogs/WebpackBaseConfig.md'
import GulpPlugin from '../../blogs/GulpPlugin.md'

import './style.less'

const blogs = [
	WebpackBaseConfig,
	GulpPlugin
]

class MyBlog extends React.Component {
	render() {
		return (
			<div className="blogs">
				{
					blogs.map(content => (
						<div className="blog">
							<Markdown data={content} />
						</div>
					))
				}
			</div>
		)
	}
}

export default MyBlog
