$(function(){
	$('#to-top').click(function(){
		$('html, body').animate({
            scrollTop: 0
        }, 300);
	})

	$(window).scroll(function(){
		$(window).scrollTop() > 50 ? $('#to-top').removeClass('hide') : $('#to-top').addClass('hide');
	})

	$('body').minimodal();
})