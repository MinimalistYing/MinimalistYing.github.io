import React from 'react'
import Memo from '../Memo'
import * as memos from '../../memos'
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
	...compability.split('---'),
	...css.split('---'),
	...http.split('---'),
	...jquery.split('---'),
	...js.split('---'),
	...other.split('---'),
	...react.split('---'),
	...vue.split('---'),
	...webpack.split('---'),
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
