(function ($) {
  /**
   * Slideshow functional.
   */
  Drupal.behaviors.slideshowCT = {
    attach: function () {


      if($(".slideshow").length) {
        var Slideshow = {};

        Slideshow.resize = function () {
          $(".slideshow").each(function() {
            var $slideshow = $(this);
            var $slides = $slideshow.find(".slide");
            var $scroller = $slideshow.find(".slideshow-scroller");
            var $body = $("body");

            //////////////////////////
            $slideshow.removeAttr("style");
            var body_width = $body.width();
            var diff_width = body_width - $slideshow.width();
            var margin = 0;
            if (diff_width > 0) {
              margin = diff_width / 2;
            }
            var negative_margin = margin * (-1);
            $slideshow.css({
              "width": body_width,
              "margin-left": negative_margin,
              "margin-right": negative_margin
            });
            if ($slideshow.offset().left !== 0) {
              $slideshow.css({
                "margin-left": (margin + $slideshow.offset().left) * (-1),
                "margin-right": (margin - $slideshow.offset().left) * (-1)
              });
            }
            $slideshow.removeClass("hidden");
            /////////////////////////////
            $slides.css({width: $body.width()});
            $scroller.css({width: $slides.width() * $slides.length});

            Slideshow._resizeSlides($slideshow);
            Slideshow._setupIndicatorPosition($slideshow);
            Slideshow._setupButtonPosition($slideshow);
          });
        };

        Slideshow._resizeSlides = function ($slideshow) {
          var $slides = $slideshow.find(".slide");
          var $imgWrappers = $slides.find(".slide-img");
          var $imgs = $imgWrappers.find("img");
          var aspectRatio = $(window).width() / $(window).height();

          $imgs.removeAttr("style");
          $imgWrappers.removeAttr("style");

          // Get the max height of all landscape
          var slideHeights = $slides.not(".portrait").map(function () {
            return $(this).find(".slide-img img").height();
          }).get();
          var slideWidths = $slides.not(".portrait").map(function () {
            return $(this).find(".slide-img img").width();
          }).get();

          var viewportHeight = $(window).height();
          var viewportOptimizedHeight = parseInt(viewportHeight * 0.9);

          var defaultHeight = $("body").width() * 0.625;
          var maxHeight = Math.max.apply(null, slideHeights);
          if (($slides.parent(".standalone").size() && maxHeight < defaultHeight) || $slides.size() === 1) {
            maxHeight = defaultHeight;
          }
          maxHeight = Math.max(maxHeight, 480);
          /** optimize slider height */
          // if (maxHeight > 480 && viewportOptimizedHeight > 480) {
          //   maxHeight = viewportOptimizedHeight;
          // }
          if (maxHeight > viewportOptimizedHeight) {
            maxHeight = viewportOptimizedHeight;
          }
          if ($slides.length === 1 && slideHeights[0]/slideWidths[0] < 0.60) {
            maxHeight = slideHeights[0];
          }
          $imgs.css({
            "maxHeight": maxHeight + "px",
            "width": "auto"
          });

          $slides.filter(".portrait").find(".slide-img img").css({width: "auto"});

          // Get the max width of all images after resizing
          var slidesImgWidths = $slides.map(function () {
            return $(this).find(".slide-img img").width();
          }).get();

          var maxSlideImgWidth = Math.max.apply(null, slidesImgWidths);

          $slides.filter(".title-slide").find(".text-container").css({
            "width": maxSlideImgWidth - 100 + "px"
          });

          // Mobile resizing rules
          if ($(window).width() < 769 && aspectRatio < 1) {
            var $portraitSlides = $slides.filter(".portrait").not(".title-slide, .end-slide"),
              $landscapeSlides = $slides.not(".portrait, .title-slide, .end-slide"),
              $capSlides = $slides.filter(".title-slide, .end-slide"),
              slideshowHeight;

            // Horizontally center portrait images
            $portraitSlides.find(".slide-img img").css({
              "height": "100%"
            });

            // Vertically center landscape images
            $landscapeSlides.each(function () {
              var $img = $(this).find(".slide-img img");

              $img.css({
                position: "relative",
                top: "0",
                transform: "translateY(0)",
              });
            });

            if ($slides.length > 1) {
              // Now we can calculate the total slideshow height...
              slideshowHeight = $slides.parents(".slideshow-wrapper").height();

              $capSlides.find(".slide-img").css({
                "height": slideshowHeight + "px"
              });
              $capSlides.find(".slide-img img").css({
                "height": slideshowHeight + "px",
                "width": "auto"
              });
            }
          }
          // Landscape-orientation resizing rules
          else if ($(window).width() < 769 && aspectRatio > 1.45) {
            maxHeight = $(window).height() * 0.75 - 40 + "px";

            $slides.find("img").css({
              height: maxHeight,
              width: "auto",
              top: "0",
              transform: "translateY(0)",
            });
          }
          else {
            $(".slide-img", $slides).css({
              height: maxHeight
            });
          }
        };

        Slideshow.setup = function() {
          $(".slideshow").each(function() {
            var $slideshow = $(this);

            // Move width, height attributes for each images into 'data'
            $slideshow.find(".slide .slide-img img").each(function() {
              var $image = $(this);
              if ($image.is("[width]")) {
                $image.data("width", $image.attr("width")).removeAttr("width");
              }
              if ($image.is("[height]")) {
                $image.data("height", $image.attr("height")).removeAttr("height");
              }
            });

            Slideshow._setSizes($slideshow);

            var wrapper = $slideshow.find(".slideshow-wrapper");
            var slideshowScroll = new IScroll(wrapper[0], {
              scrollX: true,
              scrollY: false,
              momentum: false,
              snap: ".slide",
              bounce: false,
              touch: true,
              eventPassthrough: true,
              snapSpeed: 600,
              resizePolling: 200,
              bindToWrapper: true
            });
            Slideshow._setupIndicator($slideshow, slideshowScroll);
            Slideshow._setupControls($slideshow, slideshowScroll);
          });
          //Slideshow.resize();
        };

        /** DONE */
        Slideshow._setSizes = function ($slideshow) {
          var $scroller = $slideshow.find(".slideshow-scroller");
          var $slides = $slideshow.find(".slide");

          $slides.css({width: $("body").width()});
          $scroller.css({
            width: $slides.width() * $slides.length,
          });

          Slideshow._resizeSlides($slideshow);
          Slideshow._setupIndicatorPosition($slideshow);
          Slideshow._setupButtonPosition($slideshow);
        };

        /** DONE */
        Slideshow._setupIndicator = function ($slideshow, slideshowScroll) {
          slideshowScroll.on("scrollEnd", function () {
            var $indicator = $slideshow.find(".slideshow-indicator");
            var currentPage = slideshowScroll.currentPage.pageX + 1;
            var totalPages = $slideshow.find(".slide").length;

            $(".indicator-current", $indicator).html(slideshowScroll.currentPage.pageX + 1);
            $(".ss-icon", $indicator).removeClass("inactive");

            if (currentPage === 1) {
              $(".ss-icon.prev", $indicator).addClass("inactive");
            }
            if (currentPage === totalPages) {
              $(".ss-icon.next", $indicator).addClass("inactive");
            }

            // Trigger possible resize on wrapper
            $(slideshowScroll.wrapper).css({
              height: $(slideshowScroll.wrapper).find(".slide:eq(" + (slideshowScroll.currentPage.pageX) + ")").height(),
            });
          });
        };

        /** DONE */
        Slideshow._setupIndicatorPosition = function ($slideshow) {
          var $slides = $slideshow.find(".slide");
          var $indicator = $slideshow.find(".slideshow-indicator");
          var slideHeight = $slides.find(".slide-img").height(),
            indicatorHeight = $indicator.outerHeight(),
            indicatorMargin = 20;
          if ($("body").width() > 768) {
            $indicator.css({
              position: "relative",
              top: slideHeight + indicatorHeight + indicatorMargin + "px",
              zIndex: "2"
            });
          }
          else {
            $indicator.removeAttr("style");
          }
        };

        /** DONE */
        Slideshow._setupButtonPosition = function ($slideshow) {
          var $slides = $slideshow.find(".slide");
          var $buttons = $slideshow.find(".slideshow-button");
          var slideHeight = $slides.find(".slide-img").height();
          var buttonHeight = $buttons.height();

          $buttons.css({
            "top": (slideHeight / 2) - (buttonHeight / 2) + 20 + "px"
          });
        };

        /** DONE */
        Slideshow._setupControls = function ($slideshow, slideshowScroll) {
          var $controls = $slideshow.find(".slideshow-control");
          $controls.bind("click", function (e) {
            e.preventDefault();

            if ($(this).hasClass("next")) {
              slideshowScroll.next(400);
            }
            else if ($(this).hasClass("prev")) {
              slideshowScroll.prev(400);
            }
            else if ($(this).hasClass("restart")) {
              slideshowScroll.goToPage(0, 0, 400);
            }

            // Trigger possible resize on wrapper
            $(slideshowScroll.wrapper).css({
              height: $(slideshowScroll.wrapper).find(".slide:eq(" + (slideshowScroll.currentPage.pageX) + ")").height(),
            });
          });
        };

        $(window).bind("resize", function () {
          Slideshow.resize();
        });

        setTimeout(function () {
          Slideshow.setup();
          Slideshow.resize();
        }, 3000);

      }
    }
  };

  Drupal.behaviors.articleImageLazyLoad = {
    attach: function () {

      var stickyResize = function() {
        var $body = $("body");
        var body_width = $body.width();
        var window_height = $(window).height();


        var maxHeight = body_width * 0.625;
        maxHeight = Math.min(maxHeight, window_height - 50);
        if (window_height > body_width) {
          maxHeight = window_height - 50;
        }

        $(".slideshow-mimic-image").each(function (index, el) {
          var $slideshow = $(el);
          var margin = 0;
          if ($slideshow.offset().left !== 0) {
            margin = ($slideshow.offset().left) * (-1);
          }

          $slideshow.css({"padding-bottom": "20px"});
          $slideshow.find("div.ll-wrapper").css({
            "width": body_width,
            "margin-left": margin,
            "margin-right": margin,
            "background": "none",
            "text-align": "center",
          });

          $slideshow.find("img").css({
            "maxHeight": maxHeight + "px",
            "position": "relative",
            "width": ""
          }).attr("style", function(i,s) { return s + "width: auto !important;" });
        });

        Waypoint.refreshAll();
      };

      $(window).scroll(function(){
        Waypoint.refreshAll();
      });
      $(window).resize(function(){
        stickyResize();
      });

      var $window_height = $(window).height();

      $(".article-image > img, .article-image > a > img").once("articleImageLazyLoad", function () {

        var el = this;

        //Avoid to apply Waypoint for images, whick should be displayed on page load on the screen
        if($(el).offset().top <= $window_height) {
          var $src = $(this).attr("src");
          var $data_src = $(this).data("src");
          if ($data_src && $data_src !== $src) {
            $(this).attr("src", $data_src);
          }
          return;
        }

        if (!$(this).data("src")) {
          $(this).data("src", $(this).attr("src"));
        }

        // Transparent 1x1 pixel.
        var placeholder_src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        if (typeof Drupal.settings.lazyloader !== 'undefined' && Drupal.settings.lazyloader.icon) {
          placeholder_src = Drupal.settings.lazyloader.icon;
        }

        $(this)
          .attr("src", placeholder_src)
          .css({
            display: "inline-block"
          })
          .wrap("<div class=\"ll-wrapper\"></div>")
          .parent()
          .css({
            display: "inline-block",
          });

        new Waypoint({
          element: $(el).parent().get(0),
          handler: function() {
            var $img = $(el);

            // Get src from data attr and hide placeholder image.
            if ($img.data("src")) {
              var image = new Image();
              image.onload = function () {
                $img
                  .attr("src", $img.data("src"))
                  .removeAttr('data-src')
                  .css({
                    opacity: 0
                  })
                  .animate({opacity: 1}, 100);

              };
              image.src = $img.data("src");

              this.destroy();

            }
          },
          offset: 2000
        });
      });
      stickyResize();
    }
  };
})(jQuery);
