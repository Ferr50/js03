(function($) {

Drupal.behaviors.birdCardSet = {
  attach: function(context, settings) {
    $(".bird-card-set").once('birdCardSet', function() {

      function setUpBirds(shouldSnap) {
        $(".bird-card-set").each(function() {
          var $this = $(this),
                  $wrapper = $this.find(".bird-card-container"),
                  $indicator = $this.find(".indicator"),
                  scroll;

          if ($wrapper.length === 0) {
            return;
          }
          scroll = new IScroll($wrapper[0], {
            scrollX: true,
            scrollY: false,
            momentum: false,
            snap: shouldSnap,
            bounce: true,
            touch: true,
            eventPassthrough: true,
            snapSpeed: 600
          });

          scroll.on("scrollEnd", function() {
            $indicator.find("i").removeClass("disabled");

            if (this.x == 0) {
              $indicator.find(".indicator-left").addClass("disabled");
            }
            else if (this.x == (-1000 + $this.width())) {
              $indicator.find(".indicator-right").addClass("disabled");
            }
          });
        });
      }

      $(document).bind("respond", function(e) {
        if (e.size == "tiny") {
          setUpBirds(true);
        }
        else {
          setUpBirds(false);
        }
      });
    });
  }
};

  Drupal.behaviors.sliderScoreCard = {
    attach: function (context) {
      var $slierWrap = $('.slider-element.bird-page', context);
      if ($slierWrap.length) {
        $('.items-wrap', $slierWrap).owlCarousel({
          loop: true,
          responsiveClass: true,
          pagination: true,
          itemsCustom: [
            [0, 1],
            [769, 3],
            [1024, 4]
          ]
        })
      }
    }
  };

})(jQuery);
