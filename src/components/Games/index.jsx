import { importManager } from 'less'
import React, { useState } from 'react'
import './index.less'

export default function Games () {
  return (
    <div className="games">
      {images.map(image => (
        <figure key={image.url}>
          <ImageCard image={image} />
          <figcaption>{image.title}</figcaption>
        </figure>
      ))}
    </div>
  )
}

function ImageCard ({ image }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const width = window.innerWidth * 3.5 / 5;
  const halfWidth = width / 2;
  const height = width * ( 9 / 16 );
  const halfHeight = height / 2;

  function handleMouseMove (e) {
    const { offsetX, offsetY } = e.nativeEvent
    setRotateY(15 * (offsetX - halfWidth) / halfWidth)
    setRotateX(-15 * (offsetY - halfHeight) / halfHeight)
  }

  return (
    <img
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setRotateY(0)
        setRotateX(0)
      }}
      src={image.url}
      alt={image.title}
      style={{
        width,
        height,
        transform: `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      }}
    />
  )
}

const images = [{
  title: '守望先锋 Overwatch',
  url: 'https://s3.ax1x.com/2020/12/02/Do1DKS.jpg',
}, {
  title: '最终幻想 15',
  url: 'https://s3.ax1x.com/2020/11/24/DNTi0s.jpg',
}, {
  title: '最终幻想 零式 FINAL FANTASY TYPE-0',
  url: 'https://s3.ax1x.com/2020/11/24/DNTF7n.jpg',
}, {
  title: '最终幻想 10',
  url: 'https://s3.ax1x.com/2020/11/24/DNTAkq.jpg',
}, {
  title: '刺客信条 兄弟会 Assassins Creed Brotherhood',
  url: 'https://s3.ax1x.com/2020/11/24/DNT7CV.jpg',
}, {
  title: '阿门罗 Armello',
  url: 'https://s3.ax1x.com/2020/11/24/DNTH3T.jpg',
}, {
  title: 'Spellbreak',
  url: 'https://s3.ax1x.com/2020/11/24/DNTbgU.jpg',
}, {
  title: '碧蓝幻想 Versus',
  url: 'https://s3.ax1x.com/2020/11/24/DNTqvF.jpg',
}, {
  title: '古剑奇谭3',
  url: 'https://s3.ax1x.com/2020/11/24/DNTXDJ.jpg',
}, {
  title: '命运2',
  url: 'https://s3.ax1x.com/2020/11/24/DNTjb9.jpg',
}, {
  title: '泰坦陨落2',
  url: 'https://s3.ax1x.com/2020/11/24/DNTxER.jpg',
}, {
  title: '激战2',
  url: 'https://s3.ax1x.com/2020/11/24/DNTzU1.jpg',
}, {
  title: '武侠乂',
  url: 'https://s3.ax1x.com/2020/11/24/DN7S4x.jpg',
}, {
  title: '仙侠世界2',
  url: 'https://s3.ax1x.com/2020/11/24/DN79C6.jpg',
}, {
  title: '永恒轮回 黑色幸存者 Eternal Return Black Survival',
  url: 'https://s3.ax1x.com/2020/11/24/DN7C8K.jpg',
}, {
  title: '在远方 追云者编年史 Yonder The Cloud Catcher Chronicles',
  url: 'https://s3.ax1x.com/2020/11/24/DN7PgO.jpg',
}, {
  title: '战锤 末世鼠疫2 Warhammer Vermintide 2',
  url: 'https://s3.ax1x.com/2020/11/24/DN7ivD.jpg',
}, {
  title: '战国无双 真田丸',
  url: 'https://s3.ax1x.com/2020/11/24/DN7kKe.jpg',
}, {
  title: '质量效应2 Mass.Effect.2',
  url: 'https://s3.ax1x.com/2020/11/23/DYcJHg.jpg',
}, {
  title: '中土世界：暗影魔多',
  url: 'https://s3.ax1x.com/2020/11/23/DYcGDS.jpg'
}, {
  title: '战神 God of War',
  url: 'https://s3.ax1x.com/2020/11/23/DYc8u8.jpg'
}, {
  title: '酉闪町 DuskDiver',
  url: 'https://s3.ax1x.com/2020/11/23/DYclgP.jpg'
}, {
  title: '永恒之塔',
  url: 'https://s3.ax1x.com/2020/11/23/DYc1jf.jpg'
}, {
  title: '无主之地2',
  url: 'https://s3.ax1x.com/2020/11/23/DYcQ3t.jpg'
}, {
  title: '雨纪',
  url: 'https://s3.ax1x.com/2020/11/23/DYcM9I.jpg'
}, {
  title: '羞辱 Dishonored',
  url: 'https://s3.ax1x.com/2020/11/23/DYcnNd.jpg'
}, {
  title: '旺达与巨象 Shadow of the Colossus',
  url: 'https://s3.ax1x.com/2020/11/23/DYcmAH.jpg'
}, {
  title: '我在 7 年后等着你',
  url: 'https://s3.ax1x.com/2020/11/23/DYcZHe.jpg'
}, {
  title: '铁拳 7',
  url: 'https://s3.ax1x.com/2020/11/23/DYcVBD.jpg'
}, {
  title: '泰亚史诗',
  url: 'https://s3.ax1x.com/2020/11/23/DYcEnO.jpg'
}, {
  title: '神舞幻想',
  url: 'https://s3.ax1x.com/2020/11/23/DYckjK.jpg'
}, {
  title: '天命奇御',
  url: 'https://s3.ax1x.com/2020/11/23/DYcFc6.jpg'
}, {
  title: '全面战争战锤2 Total War WARHAMMER II',
  url: 'https://s3.ax1x.com/2020/11/23/DYci1x.jpg'
}, {
  title: '瑞奇与叮当 Ratchet & Clank',
  url: 'https://s3.ax1x.com/2020/11/23/DYcpN9.jpg'
}, {
  title: '龙之皇冠 Dragons Crown Pro',
  url: 'https://s3.ax1x.com/2020/11/23/DY6x74.jpg'
}, {
  title: '去月球',
  url: 'https://s3.ax1x.com/2020/11/23/DY6vBF.jpg'
}, {
  title: '龙之谷',
  url: 'https://s3.ax1x.com/2020/11/23/DY6jnU.jpg'
}, {
  title: '猎天使魔女',
  url: 'https://s3.ax1x.com/2020/11/23/DY6OXT.jpg'
}, {
  title: '救赎之路 Sinner',
  url: 'https://s3.ax1x.com/2020/11/23/DY6LcV.jpg'
}, {
  title: '加速世界VS刀剑神域：千年的黄昏',
  url: 'https://s3.ax1x.com/2020/11/23/DY6q10.jpg'
}, {
  title: '地平线：零之曙光 Horizon Zero Dawn',
  url: 'https://s3.ax1x.com/2020/11/23/DY6bpq.jpg'
}, {
  title: '花园之间 The Gardens Between',
  url: 'https://s3.ax1x.com/2020/11/23/DY67hn.jpg'
}, {
  title: '荒野大嫖客 2',
  url: 'https://s3.ax1x.com/2020/11/23/DY6Tts.jpg'
}, {
  title: '虎豹骑',
  url: 'https://s3.ax1x.com/2020/11/23/DY6okj.jpg'
}, {
  title: '格斗领域 EX FIGHTING EX LAYER',
  url: 'https://s3.ax1x.com/2020/11/23/DY657Q.jpg'
}, {
  title: 'Goat Of Duty',
  url: 'https://s3.ax1x.com/2020/11/23/DY640g.jpg'
}, {
  title: 'KurtzPel',
  url: 'https://s3.ax1x.com/2020/11/23/DY6hnS.jpg'
}, {
  title: '刺客信条 2',
  url: 'https://s3.ax1x.com/2020/11/23/DY6WX8.jpg'
}, {
  title: '恶果之地',
  url: 'https://s3.ax1x.com/2020/11/23/DY6R6f.jpg'
}, {
  title: '天谕',
  url: 'https://s3.ax1x.com/2020/11/23/DY6skd.png'
}]
