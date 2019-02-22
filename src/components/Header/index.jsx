import React from 'react'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'

import './style.less'

class Header extends React.Component {
	render() {
		return (
			<header>
			    <h3 className="header-title" onClick={() => this.props.history.push('/')}>MinimalistYing.io</h3>
			    <nav>
			        <ul>
			            <li>
			            	<NavLink to="/" exact>博客</NavLink>
			            </li>
			            <li>
			            	<NavLink to="/memo" exact>备忘</NavLink>
			           	</li>
			            <li><a href="https://codepen.io/MinimalistYing" target="_blank">代码库</a></li>
			            <li><a href="https://leetcode.com/MinimalistYing" target="_blank">Leetcode</a></li>
			            <li><a href="https://stackoverflow.com/users/8459774/minimalistying" target="_blank">StackOverflow</a></li>
			            <li><a href="https://github.com/MinimalistYing" target="_blank">Github</a></li>
			        </ul>
			    </nav>
			</header>
		)
	}
}

export default withRouter(Header)
