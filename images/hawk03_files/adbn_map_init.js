window.$ = jQuery;
window.JQ2 = jQuery;

(function ($) {

  Drupal.behaviors.adbnMapInit = {
    attach: function (context, settings) {
      Drupal.adbnMap = {};

      var pageOverlay;
      var togglePageOverlay = function () {
        if (typeof pageOverlay === 'undefined') {
          $("body").append(
            pageOverlay = $('<div id="page-overlay"></div>')
          );
          pageOverlay.css("height", $(document).height());
          pageOverlay.click(function (e) {
            $(".climate-flyway-overlay").addClass('element-hidden');
            togglePageOverlay();
          });
        }
        if (pageOverlay.css("display") == "none") {
          pageOverlay.css("display", "block");
        }
        else {
          pageOverlay.css("display", "none");
        }
      };

      // Bind the escape key to also close the overlay popup.
      $('#bird-detail-popup .close').click(function (e) {
        // Escape key was pressed.
        $('.climate-flyway-overlay').addClass('element-hidden');
        togglePageOverlay();
      });

      $('.open-bird-detail-popup').click(function (e) {
        e.preventDefault();
        $(this).parents('.map-elements, .map-header, h5, .strip-call, .call').siblings('.climate-flyway-overlay').removeClass('element-hidden');
        togglePageOverlay();
      });
    }
  }

})(jQuery);
