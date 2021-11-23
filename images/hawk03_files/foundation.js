/**
 * Init foundation javascripts.
 */

(function($) {
  Drupal.behaviors.equalizer = {
    attach: function(context, settings) {
      $('body').once('foundation').foundation({
        equalizer : {
          // Specify if Equalizer should make elements equal height once they become stacked.
          equalize_on_stack: true
        }
      });
    }
  };
})(jQuery);
