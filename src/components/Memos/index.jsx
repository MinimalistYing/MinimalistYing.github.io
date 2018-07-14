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

class Memos extends React.Component {
	render() {
		return (
			<main className="memos">
				<section className="js memo-wrap">
					{
						js.map((o, index) => <Memo key={index} data={o} />)
					}
				</section>
				
				<section className="css memo-wrap">
					{
						css.map((o, index) => <Memo key={index} data={o} />)
					}
				</section>

				<section className="vue memo-wrap">
					{
						vue.map((o, index) => <Memo key={index} data={o} />)
					}
				</section>

				<section className="react memo-wrap">
					{
						react.map((o, index) => <Memo key={index} data={o} />)
					}
				</section>

				<section className="webpack memo-wrap">
					{
						webpack.map((o, index) => <Memo key={index} data={o} />)
					}
				</section>

				<section className="jquery memo-wrap">
					{
						jquery.map((o, index) => <Memo key={index} data={o} />)
					}
				</section>

				<section className="http memo-wrap">
					{
						http.map((o, index) => <Memo key={index} data={o} />)
					}
				</section>

				<section className="compability memo-wrap">
					{
						compability.map((o, index) => <Memo key={index} data={o} />)
					}
				</section>

				<section className="other memo-wrap">
					{
						other.map((o, index) => <Memo key={index} data={o} />)
					}
				</section>
			</main>
		)
	}
}

export default Memos
