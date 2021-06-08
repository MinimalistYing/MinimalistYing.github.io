import React from 'react'
import marked from 'marked'

import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import plaintext from 'highlight.js/lib/languages/plaintext';
import html from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/monokai-sublime.css'
import './style.less'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('plaintext', plaintext)
hljs.registerLanguage('html', html)

marked.setOptions({
	highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
})

export default function Markdown(props) {
	return (
		<div className="my-md" dangerouslySetInnerHTML={{ __html: marked(props.data) }}></div>
	)
}
