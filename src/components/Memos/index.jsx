import React from 'react'

import JavaScript from '../../memos/js.js'

import Memo from '../Memo/index.jsx'

class Memos extends React.Component {
	render() {
		return (
			<div className="memos">
				({
					JavaScript.map(o => <Memo data={o} />)
				})
			</div>
		)
	}
}

export default Memos
