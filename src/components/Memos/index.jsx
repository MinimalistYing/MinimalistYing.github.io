import React from 'react'
import Memo from '../Memo/index.jsx'

import JavaScript from '../../memos/js.js'
import Css from '../../memos/css.js'
import Gulp from '../../memos/gulp.js'
import Vue from '../../memos/vue.js'
import Webpack from '../../memos/webpack.js'

import './index.less'

class Memos extends React.Component {
	render() {
		return (
			<main className="memos">
				<section className="js memo-wrap">
					{
						JavaScript.map((o, index) => <Memo key={index} data={o} />)
					}
				</section>
				
				<section className="css memo-wrap">
					{
						Css.map((o, index) => <Memo key={index} data={o} />)
					}
				</section>

				<section className="gulp memo-wrap">
					{
						Gulp.map((o, index) => <Memo key={index} data={o} />)
					}
				</section>

				<section className="vue memo-wrap">
					{
						Vue.map((o, index) => <Memo key={index} data={o} />)
					}
				</section>

				<section className="webpack memo-wrap">
					{
						Webpack.map((o, index) => <Memo key={index} data={o} />)
					}
				</section>
			</main>
		)
	}
}

export default Memos
