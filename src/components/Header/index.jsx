import React from 'react'
import { NavLink } from 'react-router-dom'

import './style.less'

class Header extends React.Component {
	render() {
		return (
			<header>
			    <h3 className="header-title">MinimalistYing.io</h3>
			    <nav>
			        <ul>
			            <li>
			            	<NavLink to="/" exact>Home</NavLink>
			            </li>
			            <li>
			            	<NavLink to="/memo" exact>Memo</NavLink>
			           	</li>
			            <li><a href="https://jsfiddle.net/user/MinimalistYing/fiddles/" target="_blank">CodeBase</a></li>
			            <li><a href="https://leetcode.com/MinimalistYing" target="_blank">Leetcode</a></li>
			            <li><a href="https://stackoverflow.com/users/8459774/minimalistying" target="_blank">StackOverflow</a></li>
			            <li><a href="https://github.com/MinimalistYing" target="_blank">Github</a></li>
			        </ul>
			    </nav>
			</header>
		)
	}
}

export default Header