import React from 'react'

class Memo extends React.Component {
	render() {
		return (
			<div className="memo">
				<div className="memo-content">
					{this.props.data.content}
				</div>
				<span>{this.props.data.date}</span>
			</div>
		)
	}
}

export default Memo
