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
	vue
} = memos
const all = [
	...compability.split('---'),
	...css.split('---'),
	...http.split('---'),
	...jquery.split('---'),
	...js.split('---'),
	...other.split('---'),
	...react.split('---'),
	...vue.split('---')
]

// 按照字数从多到少排列
all.sort((a, b) => a.length - b.length)

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
