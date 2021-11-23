(function($) {

$(function() {
  $(".strip-nav").each(function() {
    var $this = $(this),
        $list = $this.find("ul"),
        $items = $list.find("li"),
        listWidth = 0,
        listPadding = 40;

    setTimeout(function() {
      $items.each(function() {
        listWidth += $(this).outerWidth();
      });

      $list.css("width", listWidth + listPadding + "px");

      var scroll = new IScroll($this.find(".columns")[0], {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: false,
        bounce: true,
        touch: true,
        eventPassthrough: true
      });
    }, 100);
  });
});

})(jQuery);
