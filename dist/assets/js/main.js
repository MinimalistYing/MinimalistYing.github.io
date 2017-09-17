// 滚动到自定义的伪锚点
function scrollToAnchor(){
	// 获取url的hash值 为了阻止锚点的默认行为 这里在每个Hash前加了一个_
	// 去掉后才是真正的锚点name
	var hash = window.location.hash.substring(1).slice(1), 
		anchorDom; // 伪锚点dom对象

	anchorDom = document.querySelector(`a[name="${hash}"]`) && document.querySelector(`a[name="${hash}"]`).parentNode;

	anchorDom && animationToAnchor(document.body.scrollTop, anchorDom.offsetTop - 60);
}

/**
 * 滚动到指定位置方法
 * @param  {Number} start 开始位置
 * @param  {Number} stop  结束位置
 */
function animationToAnchor(start, stop){
    var next;

	if (stop === start) {// 不需要滚动
		return;
	}

	if (stop > start) {// 下滑
		next = start + 50;

		if (next > stop){// 避免滑过头
			next = stop;
		}
	} else {// 上滑
		next = start - 50;

		if (next < stop){// 避免滑过头
			next = stop;
		}
	}
    

    // 如丝般顺滑
    window.requestAnimationFrame(function(){
        document.body.scrollTop = next;

        // 滚动到预定位置则结束
        if(next === stop){
            return;
        }

        animationToAnchor(next, stop); // 递归 滚动至锚点对应位置为止
    });
}

/**
 * 向下滚动时收起头部导航 向上滚动时展开头部导航
 */
function toggleHeader() {
  var lastScrollTop = document.body.scrollTop,
    header = document.getElementsByTagName('header')[0],
    main = document.getElementsByTagName('main')[0],
    infoWrap = document.getElementsByClassName('info-wrapper')[0];

  document.onscroll = () => {
    // 避免滚动最底部时由于头部收起 滚动条变短引起的页面抖动
    if (document.body.scrollTop + 65 < document.body.scrollHeight - window.innerHeight) {
      if (document.body.scrollTop > lastScrollTop && !header.className) {
        header.className = 'hide-top';
        main.className = main.className + ' hide-top';

        if (infoWrap) {
          infoWrap.className = infoWrap.className + ' hide-top';
        }
      } else if (document.body.scrollTop < lastScrollTop && header.className === 'hide-top') {
        header.className = '';
        main.className = main.className.replace(' hide-top', '');

        if (infoWrap) {
          infoWrap.className = infoWrap.className.replace(' hide-top', '');
        }
      }
    }
    
    lastScrollTop = document.body.scrollTop;
  }
}

window.onhashchange = function(){
	scrollToAnchor();
};

window.onload = function() {
	var $nav = document.getElementsByTagName('nav')[0]
	var $a  = $nav.getElementsByTagName('a')

	for (let i = $a.length - 1; i >= 0; i--) {
		let $aChild = $a[i];

		$a[i].parentNode.onclick = () => {
			$aChild.click();
		}
	}

	scrollToAnchor();

    toggleHeader();
}