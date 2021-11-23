(function($) {
  Drupal.behaviors.flywaySlides = {
    attach: function(context, settings) {
      var $slides = $(".flyway-slide"),
          $links = $(".flyway-slide-button");

      // Navigation links above
      $(".flyway-slide-button").once('flywaySlides').bind("click", function(e) {
        e.preventDefault();

        var $this = $(this),
            href = $this.attr("href"),
            $newSlide = $(href);

        $links.removeClass("current");
        $this.addClass("current");

        $slides.removeClass("current");
        $newSlide.addClass("current");
      });

      // Next and previous paddles on the side
      $(".flyway-slides-paddle").once('flywaySlides').bind("click", function(e) {
        e.preventDefault();

        var $this = $(this),
                $currentSlide = $slides.filter(".current"),
                $link = "",
                $newSlide = "";

        if ($this.hasClass("next")) {
          $newSlide = $currentSlide.next(".flyway-slide");
          if ($newSlide.length == 0) {
            $newSlide = $slides.first();
          }
        }
        else if ($this.hasClass("prev")) {
          $newSlide = $currentSlide.prev(".flyway-slide");
          if ($newSlide.length == 0) {
            $newSlide = $slides.last();
          }
        }

        $link = $links.filter("[href='#" + $newSlide.attr("id") + "']");
        $links.removeClass("current");
        $link.addClass("current");

        $slides.removeClass("current");
        $newSlide.addClass("current");
      });
    },
  };

})(jQuery);
