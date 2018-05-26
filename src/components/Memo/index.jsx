import React from 'react'
import ReactMarkdown from 'react-markdown'

import './style.less'

class Memo extends React.Component {
	render() {
		return (
			<div className="memo">
				<div className="memo-content">
					<ReactMarkdown source={this.props.data.content} />
				</div>
				<span className="memo-date">{this.props.data.date}</span>
			</div>
		)
	}
}

export default Memo
