import React from 'react'
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
import Npm from '@blog/Npm.md'
import CookieAndWebStorage from '@blog/CookieAndWebStorage.md'
import XSSCSRF from '@blog/XSS&CSRF.md'

import './style.less'

const blogs = [
	WebpackBaseConfig,
	GulpPlugin,
	SymbolBlog,
	IteratorBlog,
	WebpackV3ToV4,
	Generator,
	ArrayAPI,
	ObjectAPI,
	Collections,
	PromiseBlog,
	PreventModalScroll,
	Redux,
	ReactRedux,
	BinaryTreeTraversal,
	SourceMapAndWebpack,
	WebpackCommonProblem,
	CrossOrigin,
	Npm,
	CookieAndWebStorage,
	XSSCSRF
]

class MyBlog extends React.Component {
	render() {
		return (
			<div className="blogs">
				{
					blogs.map((content, index) => (
						<div className="blog" key={index}>
							<Markdown data={content} />
						</div>
					))
				}
			</div>
		)
	}
}

export default MyBlog
