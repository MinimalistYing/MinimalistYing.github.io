import React from 'react'

import Avatar from './images/avatar.jpg'
import './style.less'

class Resume extends React.Component {
	render() {
		return (
			<div className="info-wrapper">
			    <div className="info">
			        <div className="info-photo">
			            <img src={Avatar} alt="my icon" />
			        </div>
			        <div className="skill-wrapper">
			            <span className="skill-tag">jQuery</span>
			            <span className="skill-tag">Gulp</span>
			            <span className="skill-tag">Webpack</span>
			            <span className="skill-tag">Sass</span>
			            <span className="skill-tag">Less</span>
			            <span className="skill-tag">Vue</span>
			            <span className="skill-tag">React</span>
			            <span className="skill-tag">正则</span>
			        </div>
			        <div className="info-message">
			            <p>Age : 23</p>
			            <p>Front-End Developer</p>
			            <p>E-mail : genius_ying@163.com</p>
			            <p>南京邮电大学</p>
			            <p>杭州三汇数字信息技术有限公司</p>
			            <p>杭州数梦工场科技有限公司</p>
			            <p>二维火</p>
			        </div>
			    </div>
			</div>
		)
	}
}

export default Resume