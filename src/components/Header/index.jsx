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
			            <li><a href="https://jsfiddle.net/user/MinimalistYing/fiddles/">CodeBase</a></li>
			            <li><a href="https://www.hackerrank.com/MinimalistYing">HackerRank</a></li>
			            <li><a href="https://github.com/MinimalistYing">Github</a></li>
			        </ul>
			    </nav>
			</header>
		)
	}
}

export default Header