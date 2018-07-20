import React from 'react'
import Markdown from '@/Markdown'
import WebpackBaseConfig from '../../blogs/WebpackBaseConfig.md'

import './style.less'

class MyBlog extends React.Component {
	render() {
		return (
			<div className="blogs">

				<div className="blog">
					<Markdown data={WebpackBaseConfig} />
				</div>
			</div>
		)
	}
}

export default MyBlog
