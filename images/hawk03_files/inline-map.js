(function($) {

$(function() {
  var $mask = $(".inline-map-mask"),
      $body = $("body");

  $body.bind("click touchend", function(e) {
    if(!$(e.target).hasClass("inline-map-mask")) {
      $mask.removeClass("off");
    }
  });

  $mask.bind("click touchend", function() {
    $mask.addClass("off");
  });
});

})(jQuery);
