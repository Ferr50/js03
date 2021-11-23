(function($) {

$(function() {
  $(document).bind("respond", function(e) {
    if(e.size == "tiny" || e.size == "small") {
      respondSmall();
    }
    if(e.size == "medium" || e.size == "large") {
      respondLarge();
    }
  });

  function respondSmall() {
    $("#in-the-news").after($("#in-action"));
  }

  function respondLarge() {
    $("#in-action").after($("#in-the-news"));
  }
});

})(jQuery);
