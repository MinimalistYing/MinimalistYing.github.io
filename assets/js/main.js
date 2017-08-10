window.onload = function() {
	var $nav = document.getElementsByTagName('nav')[0]
	var $a  = $nav.getElementsByTagName('a')

	for (let i = $a.length - 1; i >= 0; i--) {
		let $aChild = $a[i];

		$a[i].parentNode.onclick = () => {
			$aChild.click();
		}
	}
}