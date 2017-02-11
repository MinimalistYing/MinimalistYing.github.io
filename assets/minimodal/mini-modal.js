(function($, window){
	var MiniModal = function (element, options) {
		this.templates = {
			wrapper : '<div class="minimodal-wrapper"></div>',
			body    : '<div class="minimodal-body"></div>',
			foot    : '<div class="minimodal-foot"></div>',
		}
		this.init(element, options);
	};

	var renderModal = function () {
        return $(this.templates.wrapper)
        .appendTo($('body'))
        .append($(this.templates.body))
        .append($(this.templates.foot))
        .hide();
	};

	MiniModal.VERSION = 1.0;

    MiniModal.prototype.DEFAULTS = {
    	width : 500,
    	height : 300,
    	top: 200,
    	backgroundColor: 'white'
    }

    MiniModal.prototype.init = function(element, options) {
    	var $wrapper = renderModal();
    	wrapper.css({
    		width  : options.width,
    		height : options.height,
    		top    : options.top,
    		backgroundColor : options.backgroundColor,
    		left   : ($(window).innerWidth - options.width)/2
    	})
    	this.$element = element;
        $wrapper.show();

    }

	$.fn.minimodal = function (options) {
		var opt = $.extend({}, MiniModal.defaults, options);
		return this.each(function(){
			var modal = new MiniModal($(this), options);
		})
	}

})(jQuery, window);