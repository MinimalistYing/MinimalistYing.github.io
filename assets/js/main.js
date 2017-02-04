$(function(){
	$('#to-top').click(function(){
		$('html, body').animate({
            scrollTop: 0
        }, 1000);
	})

	$(window).scroll(function(){
		if ($(window).scrollTop() > 50) {
			$('#to-top').removeClass('hide');
		} else {
			$('#to-top').addClass('hide');
		}
	})
})