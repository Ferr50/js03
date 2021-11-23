(function ($) {

  /**
   * Move hero section block in DOM, change background.
   */
  Drupal.bg_respond = function (event_size) {
    var size = "";

    if (event_size == "tiny" || event_size == "small") {
      size = "small";
      $(".hero-text-container .column").append($(".hero-text"));
    }
    if (event_size == "medium" || event_size == "large") {
      size = "large";
      $(".hero-header .column").append($(".hero-text"));
    }

    $(".bg-respond").each(function () {
      var newSrc = $(this).attr("data-bg-" + size);
      if (newSrc) {
        $(this).css("background-image", "url(" + newSrc + ")");
      }
    });
  };

  /**
   * When IPE editing is finished, we need to update hero section.
   */
  Drupal.behaviors.bg_respond = {
    attach: function (context, settings) {
      $('body').once("bg_respond-endIPE", function (e) {
        $('body.panels-ipe').bind('endIPE', function () {
          Drupal.bg_respond(StateManager.state);
        });
      });
    }
  };

  $(document).bind("respond", function (e) {
    Drupal.bg_respond(e.size);
  });
})(jQuery);
