(function($, window){
    var DEFAULTS = {
        width : 500,
        height : 300,
        top: 200,
        backgroundColor: 'white',
        bodyContent : 'Add something hear~',
        bodyTextAlign: 'center',
        footContent : 'Add something hear~',
        footTextAlign: 'center',
        hasFoot : true,
        defaultShow : false,
        onDestroy: function(){}
    }
    
    var TEMPLATES = {
            wrapper : '<div class="minimodal-wrapper"></div>',
            body    : '<div class="minimodal-body"></div>',
            foot    : '<div class="minimodal-foot"></div>',
            shade   : '<div class="minimodal-shade"></div>', 
    }

    var MiniModal = function (element, options) {
        var opt = $.extend({}, DEFAULTS, options);
        init(element, opt);
    };

    MiniModal.prototype.VERSION = 1.0;

    var init = function(element, options) {  
        var $wrapper = renderModal(options);
        setStyle($wrapper, options);

        if (!options.defaultShow) {//hide modal
            $wrapper.hide();
        }
    }

    var renderModal = function (options) {
            var $shade = $(TEMPLATES.shade)
                         .appendTo($('body'))
                         .click(function(e){
                            var top    = parseFloat($shade.find('.minimodal-wrapper').css('top')),
                                left   = parseFloat($shade.find('.minimodal-wrapper').css('left')),
                                bottom = window.innerHeight - top,
                                right  = window.innerWidth - left;
                            if (e.clientX < left || e.clientX > right || e.clientY < top || e.clientY > bottom) {
                                $shade.remove();
                                if (typeof options.onDestroy === 'function') {
                                    options.onDestroy();
                                }
                            }
                            
                         });
            var $wrapper = $(TEMPLATES.wrapper)
                               .append($(TEMPLATES.body))
                               .appendTo($shade);
            if (options.hasFoot === true) {
                $wrapper.append($(TEMPLATES.foot)
                        .append(options.footContent));
            }
            return $wrapper;
    };

    var setStyle = function ($wrapper, options) {
        $wrapper.css({
            width  : options.width,
            height : options.height,
            top    : options.top,
            backgroundColor : options.backgroundColor,
            left   : (window.innerWidth - options.width)/2
        });
        $wrapper.find('.minimodal-body').css({
            height : options.height * 7/8,
            textAlign : options.bodyTextAlign
        }).append(options.bodyContent);
        $wrapper.find('.minimodal-foot').css({
            height : options.height * 1/8,
            textAlign : options.footTextAlign
        });
    }

    $.fn.minimodal = function (options) {
        return this.each(function(){
            var modal = new MiniModal($(this), options);
        })
    }

})(jQuery, window);