import React from 'react'

import Avatar from './images/avatar.jpg'
import './style.less'

class Resume extends React.Component {
	render() {
		return (
			<div class="info-wrapper">
			    <div class="info">
			        <div class="info-photo">
			            <img src={Avatar} alt="my icon" />
			        </div>
			        <div class="skill-wrapper">
			            <span class="skill-tag">jQuery</span>
			            <span class="skill-tag">Gulp</span>
			            <span class="skill-tag">Webpack</span>
			            <span class="skill-tag">Sass</span>
			            <span class="skill-tag">Less</span>
			            <span class="skill-tag">Vue</span>
			            <span class="skill-tag">React</span>
			            <span class="skill-tag">正则</span>
			        </div>
			        <div class="info-message">
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