(function($) {
  Drupal.behaviors.expand_hero = {
    attach: function(context, settings) {
      /*window.scrollTo(0, 0);*/

      var oldWidth = 0,
          oldHeight = 0;

      if ($(".hero.expand").length > 0) {

        $(".hero.expand img").load(expandHero);

        $(window).on("resize", expandHero);
      }

      // Expands the hero to window height for a dramatic effect
      function expandHero() {

        if (oldWidth == 0) {
          oldWidth = $(".hero.expand").width();
        }
        if (oldHeight == 0) {
          oldHeight = $(".hero.expand").height();
        }

        // Assume 2:3 aspect ratio if we can't calculate it
        if (oldHeight == 0) {
          oldHeight = oldWidth * 0.666667;
        }

        var windowHeight = $(window).height(),
            windowWidth = $(window).width(),
            aspectRatio = windowWidth / windowHeight,
            $hero = $(".hero.expand"),
            $img = $hero.find("img");

        // Only expand for large screens
        if (windowWidth > 768) {
          var newHeight = windowHeight - $hero.offset().top,
              newWidth = (newHeight / oldHeight) * oldWidth,
              bleed = (newWidth - windowWidth) / -2;

          $hero.css({"height": newHeight + "px"});
          $img.css({
            "left": "0px",
            "max-width": "none",
            "height": "auto",
            "width": newWidth + "px"
          });

          if (newWidth > windowWidth) {
            $img.css({
              "left": bleed + "px"
            });
          }
        }
        // Everybody else gets a default-sized hero
        else {
          $hero.removeAttr("style");
          $img.removeAttr("style");
        }
      }
    }
  };
})(jQuery);
