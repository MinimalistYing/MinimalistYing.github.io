import React from 'react'
import Markdown from '../Markdown/index.jsx'

import './style.less'

class Memo extends React.Component {
	render() {
		return (
			<div className="memo">
				<div className="memo-content">
					<Markdown data={this.props.data.content} />
				</div>
				<span className="memo-date">{this.props.data.date}</span>
			</div>
		)
	}
}

export default Memo
