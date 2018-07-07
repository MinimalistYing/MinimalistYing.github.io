import React from 'react'
import marked from 'marked'

import 'highlight.js/styles/atom-one-light.css'
import './style.less'

marked.setOptions({
	highlight: function(code) {
		return require('highlight.js').highlightAuto(code).value
	}
})

function Markdown(props) {
	return (
		<div className="my-md" dangerouslySetInnerHTML={{ __html: marked(props.data) }}></div>
	)
}

export default Markdown
