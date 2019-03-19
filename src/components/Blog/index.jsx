import React from 'react'
import Scroll from 'iscroll'
import Markdown from '@/Markdown'
import WebpackBaseConfig from '@blog/WebpackBaseConfig.md'
import GulpPlugin from '@blog/GulpPlugin.md'
import SymbolBlog from '@blog/Symbol.md'
import IteratorBlog from '@blog/Iterator.md'
import WebpackV3ToV4 from '@blog/WebpackV3ToV4.md'
import Generator from '@blog/Generator.md'
import ArrayAPI from '@blog/ArrayAPI.md'
import ObjectAPI from '@blog/ObjectAPI.md'
import Collections from '@blog/Collections.md'
import PromiseBlog from '@blog/Promise.md'
import PreventModalScroll from '@blog/PreventModalScroll.md'
import Redux from '@blog/Redux.md'
import ReactRedux from '@blog/ReactRedux.md'
import BinaryTreeTraversal from '@blog/BinaryTreeTraversal.md'
import SourceMapAndWebpack from '@blog/SourceMapAndWebpack.md'
import WebpackCommonProblem from '@blog/WebpackCommonProblem.md'
import CrossOrigin from '@blog/CrossOrigin.md'
import CookieAndWebStorage from '@blog/CookieAndWebStorage.md'
import XSSCSRF from '@blog/XSS&CSRF.md'
import Ajax from '@blog/Ajax.md'
import BinaryTreeType from '@blog/BinaryTreeType.md'
import ArraySort from '@blog/ArraySort.md'
import WhyPreflight from '@blog/WhyPreflight.md'
import VueVsReact from '@blog/VueVsReact.md'
import Axios from '@blog/Axios.md'

import './style.less'

const blogs = [
	Axios,
	VueVsReact,
	WhyPreflight,
	ArraySort,
	BinaryTreeType,
	Ajax,
	XSSCSRF,
	CookieAndWebStorage,
	CrossOrigin,
	WebpackCommonProblem,
	SourceMapAndWebpack,
	BinaryTreeTraversal,
	ReactRedux,
	Redux,
	PreventModalScroll,
	PromiseBlog,
	Collections,
	ObjectAPI,
	ArrayAPI,
	Generator,
	WebpackV3ToV4,
	IteratorBlog,
	SymbolBlog,
	GulpPlugin,
	WebpackBaseConfig
]

class MyBlog extends React.Component {
	constructor() {
		super()
		this.state = {
			categories: blogs.map(content => ({
				name: content.slice(2, content.indexOf('\n'))
			})),
			nowReading: 0,
			showCategory: false
		}
	}

	componentDidMount() {
		if (window.innerWidth >= 1024) {
			setTimeout(() => new Scroll(document.getElementById('category'), {
				mouseWheel: true,
				scrollbars: true,
				fadeScrollbars: true
			}))
		}
	}

	switch = index => {
		if (window.innerWidth >= 1024) {
			this.setState({
				moveout: true
			})
			setTimeout(() => {
				this.setState({
					nowReading: index,
					moveout: false
				})
			}, 500)
		} else {
			this.setState({
				nowReading: index
			})
		}
	}

	render() {
		return (
			<div className="blogs">
				{
					blogs.map((content, i) => (
						i === this.state.nowReading && <div className={this.state.moveout ? 'blog out' : 'blog'} key={i}>
							<Markdown data={content} />
						</div>
					))
				}
				<div id="category" className={this.state.showCategory ? 'category-box show' : 'category-box'}>
					<ul className="blogs-category">
						{
							this.state.categories.map((item, index) => (
								<li key={index} onClick={() => this.switch(index)}>{item.name}</li>
							))
						}
					</ul>
				</div>
				<div className={this.state.showCategory ? 'category-toggle show' : 'category-toggle'} onClick={() => this.setState(prev => ({ showCategory: !prev.showCategory }))}></div>
			</div>
		)
	}
}

export default MyBlog
