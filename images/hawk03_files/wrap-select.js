(function($) {
  Drupal.behaviors.wrap_select = {
    attach: function (context, settings) {
      if(navigator.userAgent.match('Firefox')) {
        $('.-wrap-select').find('> select').unwrap();
        $('select:not(.wrap-select-skip)').wrap('<div class="-wrap-select"></div>');
      }
      else if(navigator.userAgent.match('MSIE 8.') || navigator.userAgent.match('MSIE 9.')) {
        $('.-wrap-select').find('> select').unwrap();
        $('select:not(.wrap-select-skip)').wrap('<div class="-wrap-select ie"></div>');
      }
    }
  };
})(jQuery);
