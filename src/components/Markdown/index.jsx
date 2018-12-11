import React from 'react'
import marked from 'marked'

import hljs from 'highlight.js/lib/highlight'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/github.css'
import './style.less'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('xml', xml)

marked.setOptions({
	highlight: function(code) {
		return hljs.highlightAuto(code).value
	}
})

function Markdown(props) {
	return (
		<div className="my-md" dangerouslySetInnerHTML={{ __html: marked(props.data) }}></div>
	)
}

export default Markdown
