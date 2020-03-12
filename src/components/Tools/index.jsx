import React from 'react'
import './index.less'

export default function Tools () {
  return (<div className='tools'>
    <div className='tools-card'>
      <h2>日常开发</h2>
      <div className='tools-content'>
        <a target='_blank' href='https://squoosh.app/'>Google 出品，图片在线压缩</a>
        <a target='_blank' href='https://www.iconfont.cn/'>Alibaba Iconfont 图标库</a>
        <a target='_blank' href='https://regexper.com/'>正则表达式可视化</a>
        <a target='_blank' href='https://www.jq22.com/code2861'>CSS3 渐变色选择器</a>
        <a target='_blank' href='https://colorable.jxnblk.com'>颜色组合对比度测试</a>
        <a target='_blank' href='http://youmightnotneedjquery.com/'>You Don't Need Jquery</a>
        <a target='_blank' href='https://colorhunt.co/'>Color Palettes for Designers and Artists</a>
        <a target='_blank' href='https://www.json.cn/'>JSON 在线解析</a>
        <a target='_blank' href='https://unbug.github.io/codelf/'>Find Real-World Usage Variable Names</a>
        <a target='_blank' href='https://bit.dev/'>Build, version and distribute reusable components. </a>
        <a target='_blank' href='https://whatwg.org/'>WHATWG - HTML / Fetch / DOM / ... 协议 </a>
      </div>
    </div>

    <div className='tools-card'>
      <h2>GitHub 开源</h2>
      <div className='tools-content'>
        <a target='_blank' href='https://ianlunn.github.io/Hover/'>Hover.css - 基于 CSS3 的鼠标悬停特效大全</a>
        <a target='_blank' href='https://reacttraining.com/react-router/'>React-Router 英文文档</a>
        <a target='_blank' href='https://surmon-china.github.io/vue-codemirror/'>Vue Codemirror - 用于展示代码的 Vue 组件</a>
        <a target='_blank' href='https://introjs.com/'>Intro.js - Web 应用新手指引</a>
        <a target='_blank' href='https://standardjs.com/'>Standard.js - 基于 ESLint 的编程规范</a>
        <a target='_blank' href='https://usehooks.com/'>useHooks - Easy to understand React Hook recipes</a>
      </div>
    </div>

    <div className='tools-half'>
      <div className='tools-card'>
        <h2>学习</h2>
        <div className='tools-content'>
          <a target='_blank' href='https://javascript.info/'>The Modern JavaScript Tutorial</a>
          <a target='_blank' href='https://mostly-adequate.gitbooks.io/mostly-adequate-guide/'>Mostly Adequate Guide to FP</a>
          <a target='_blank' href='https://learnlayout.com/'>Learn CSS Layout</a>
          <a target='_blank' href='https://css-tricks.com/'>CSS Tricks</a>
          <a target='_blank' href='https://hacks.mozilla.org/'>Mozilla Hacks</a>
        </div>
      </div>
      
      <div className='tools-card'>
        <h2>金融</h2>
        <div className='tools-content'>
          <a target='_blank' href='https://cn.tradingview.com/'>TradingView</a>
          <a target='_blank' href='http://www.cninfo.com.cn/new/index'>巨潮资讯</a>
        </div>
      </div>

      <div className='tools-card'>
        <h2>游戏</h2>
        <div className='tools-content'>
          <a target='_blank' href='https://steamcharts.com/'>Steam Charts</a>
          <a target='_blank' href='https://www.metacritic.com/'>Metacritic - Movie / TV / Game Reviews</a>
          <a target='_blank' href='https://www.nexusmods.com/'>Nexus Mods - 游戏 Mod 社区</a>
          <a target='_blank' href='https://www.2p.com/'>2P - 17173 萤火虫</a>
        </div>
      </div>
    </div>

    <div className='tools-card'>
      <h2>其它</h2>
      <div className='tools-content'>
        <a target='_blank' href='https://www.airpano.com/'>AirPano - 世界各地 360 度全景摄影</a>
        <a target='_blank' href='https://uimovement.com/'>UI Movement - 设计师创意设计分享</a>
        <a target='_blank' href='https://dos.zczc.cz/'>浏览器上玩 DOS 游戏</a>
        <a target='_blank' href='https://putianxi.github.io/'>滚蛋吧！莆田系！</a>
        <a target='_blank' href='https://flowchart.airmore.cn/'>爱莫流程图 - Web 在线画流程图</a>
      </div>
    </div>
  </div>)
}