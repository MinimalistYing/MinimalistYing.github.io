(function($, window){
	var MiniModal = function (element, options) {
        var opt = $.extend({}, this.DEFAULTS, options);
		this.init(element, opt);
	};

	MiniModal.prototype.VERSION = 1.0;

    MiniModal.prototype.DEFAULTS = {
    	width : 500,
    	height : 300,
    	top: 200,
    	backgroundColor: 'white',
        bodyContent : '添加一点内容吧~',
        hasFoot : true
    }

    MiniModal.prototype.TEMPLATES = {
            wrapper : '<div class="minimodal-wrapper"></div>',
            body    : '<div class="minimodal-body"></div>',
            foot    : '<div class="minimodal-foot"></div>',
            shade   : '<div class="minimodal-shade"></div>', 
    }

    MiniModal.prototype.init = function(element, options) {
        var renderModal = $.proxy(function () {
            var $shade = $(this.TEMPLATES.shade)
                         .appendTo($('body'))
                         .click(function(e){
                            var top    = parseFloat($shade.find('.minimodal-wrapper').css('top')),
                                left   = parseFloat($shade.find('.minimodal-wrapper').css('left')),
                                bottom = window.innerHeight - top,
                                right  = window.innerWidth - left;
                            if (e.clientX < left || e.clientX > right || e.clientY < top || e.clientY > bottom) {
                                $shade.remove();
                            }
                            
                         });
            var $wrapper = $(this.TEMPLATES.wrapper).append($(this.TEMPLATES.body)).appendTo($shade);
            if (options.hasFoot === true) {
                $wrapper.append($(this.TEMPLATES.foot));
            }
            return $wrapper;
        },this);  
    	var $wrapper = renderModal();
    	$wrapper.css({
    		width  : options.width,
    		height : options.height,
    		top    : options.top,
    		backgroundColor : options.backgroundColor,
    		left   : (window.innerWidth - options.width)/2
    	});
        $wrapper.find('.minimodal-body').css({
            height : options.height * 7/8
        }).append(options.bodyContent);
        $wrapper.find('.minimodal-foot').css({
            height : options.height * 1/8
        }).append(options.footContent || '');
    	this.$element = element;

    }

	$.fn.minimodal = function (options) {
		return this.each(function(){
			var modal = new MiniModal($(this), options);
        })
	}

})(jQuery, window);