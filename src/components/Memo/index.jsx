import React from 'react'
import Markdown from '../Markdown'

import './style.less'

class Memo extends React.Component {
	render() {
		return (
			<div className="memo">
				<Markdown data={this.props.data} />
			</div>
		)
	}
}

export default Memo
