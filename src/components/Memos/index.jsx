import React from 'react'
import { Memo } from '@'

import memos from '../../memos'

import './index.less'

const {
	compability,
	css,
	http,
	jquery,
	js,
	other,
	react,
	vue,
	webpack
} = memos
const all = [
	...compability,
	...css,
	...http,
	...jquery,
	...js,
	...other,
	...react,
	...vue,
	...webpack
]

class Memos extends React.Component {
	render() {
		return (
			<main className="memos">
				<section className="memo-wrap">
					{
						all.map((o, index) => <Memo key={index} data={o} />)
					}
				</section>
			</main>
		)
	}
}

export default Memos
