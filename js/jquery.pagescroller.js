/*
 * jQuery pagescroller (jQuery Plugin)
 *
 * Copyright (c) 2010 Tom Shimada
 *
 * Depends Script:
 *	js/jquery.js (1.3.2~)
 */

(function($) {
  $.pagescroller = {
    defaults: {
      selector: 'body',
      anchor_top: null,
      margin_top: 0,
      margin_left: 0,
      easing: 'swing',
      speed: 0.8
    },
    is_msie6: (!$.support.style && typeof document.documentElement.style.maxHeight === 'undefined'),
    is_webkit: !document.uniqueID && !window.opera && !window.sidebar && window.localStorage && typeof window.orientation == "undefined",
    is_sp: (navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0,
    uri: (location.protocol + '//' + location.hostname + '/' + (location.pathname).replace(/^\//, '') + location.search).toLowerCase()
  };

  $.pagescroller.init = function(configs) {
    configs = $.extend(this.defaults, configs);

    var anchorPattern = 'a[href*=#]';
    if (configs.anchor_top !== null) {
      anchorPattern += ':not([href$=#])';
    }
    $(anchorPattern, configs.selector).each(function() {
      var target_uri = (this.protocol + '//' + this.hostname + '/' + (this.pathname).replace(/^\//, '') + this.search).toLowerCase();
      if (this.uri != target_uri) {
        var anchor = null;
        if (this.hash) anchor = this.hash == '#' + configs.anchor_top ? 'body' : this.hash;
          else anchor = 'body';
        $(this).click(function(){
          $.pagescroller.go(anchor, configs);
          return false;
        });
      }
    });
  };

  $.pagescroller.go = function(anchor, configs, afterFunc) {
    if (!anchor) return;
    configs = $.extend(this.defaults, configs);
    var $anchor = $(anchor);
    if ($anchor.length === 0) return;
    var $window = $(window),
        offset = $anchor.offset(),
        top = offset.top - configs.margin_top,
        left = offset.left - configs.margin_left;
    if (top < 0)  top = 0;
    if (left < 0)  left = 0;
    var action;
    if (anchor == 'body') {
      action = 'top';
      top = 0;
      left = 0;
    } else {
      var $window = $(window);
      if (top > $window.scrollTop()) action = 'down';
        else action = 'up';
      var $document = $(document),
          doc_height = $document.height(),
          doc_width = $document.width();;
      if (configs.is_msie6 && doc_height > document.body.clientHeight) doc_height = document.documentElement.clientHeight;
      var max_top = doc_height - $window.height();
      if (top > max_top) top = max_top;
      if (configs.is_msie6 && doc_width > document.body.clientWidth) doc_width = document.documentElement.clientWidth;
      var max_left = doc_width - $window.width();
      if (left > max_left) left = max_left;
    }

    var $scroll = $((this.is_webkit || this.is_sp) ? 'body' : 'html'),
        distance = Math.ceil(Math.sqrt(Math.pow(Math.abs($scroll.scrollTop() - top), 2) + Math.pow(Math.abs($scroll.scrollLeft() - left), 2))),
        params = {
            scrollLeft: left,
            scrollTop: top
        };

    if (this.is_sp) {
        params = {
            scrollTop: top
        };
    }

    $scroll.animate(
      params,
      Math.ceil(distance * configs.speed),
      configs.easing,
      function() {
        if ($.isFunction(afterFunc)) afterFunc();
      }
    );
  };
})(jQuery);

