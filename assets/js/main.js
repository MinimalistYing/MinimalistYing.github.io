window.onload = function() {
	var $nav = document.getElementsByTagName('nav')[0]
	var $a  = $nav.getElementsByTagName('a')

	for (let i = $a.length - 1; i >= 0; i--) {
		let $aChild = $a[i];

		$a[i].parentNode.onclick = () => {
			$aChild.click();
		}
	}

	var $cards = document.getElementsByClassName('memo-card')

	for (let i = 0; i < $cards.length; i++) {
		$cards[i].onmouseenter = () => {
			console.info($cards[i].getElementsByClassName('memo-time')[0])
			let e = document.createEvent("MouseEvents");
			e.initEvent("onmouseenter", true, true);
			$cards[i].getElementsByClassName('memo-time')[0].dispatchEvent(e);
		}
	}
}