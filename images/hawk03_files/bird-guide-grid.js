(function($) {
  Drupal.behaviors.bird_guide_grid = {
    attach: function (context, settings) {
      $(".bg-egg").bind("click", function(e) {
        e.preventDefault();

        var $this = $(this),
            $parent = $this.parent();

        $this.toggleClass("active").toggleClass("icon-close");
        $parent.toggleClass("show-bg");
        if ($parent.hasClass("show-bg")) {
          if (typeof(settings.boa_plate_binocular.image_color) !== 'undefined') {
            $parent.css('background-image', 'url(' + settings.boa_plate_binocular.image_color + ')');
          }
        }
        else {
          if (typeof(settings.boa_plate_binocular.image_color) !== 'undefined') {
            $parent.css('background-image', 'url(' + settings.boa_plate_binocular.image_desaturated + ')');
          }
        }
      });
    }
  };
})(jQuery);
