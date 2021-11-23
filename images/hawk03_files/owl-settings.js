(function($) {
  Drupal.behaviors.nas = {
    attach: function(context, settings) {
      $(".bird-card-set .owl-carousel").owlCarousel({
        'items': 4,
        'paginationSpeed': 100,
        'navigation': true,
        'rewindNav': false,
        'pagination': false,
        'navigationText': ["<i class=\"indicator-left icon-arrow-left\"></i>", "<i class=\"indicator-right icon-arrow-right\"></i>"]
      });
    }
  };
})(jQuery);