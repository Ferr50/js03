// Load each thumbnail strip
(function ($) {
  Drupal.behaviors.grid_gallery_thumb_strip = {
    attach: function (context, settings) {
      Drupal.settings.grid_gallery = {};
      Drupal.settings.grid_gallery.totalImages = 0;
      Drupal.settings.grid_gallery.imagesVisable = 0;
      Drupal.settings.grid_gallery.imagesCount = 0;
      Drupal.settings.grid_gallery.countFromStart = 0;
      $(".thumb-strip").once().each(function() {
        var self = this;
        var totalImages = Drupal.settings.grid_gallery.totalImages = $('img', this).size();
        var loadedImages = 0;

        $('a.colorbox', this).click(function (e) {
          e.preventDefault();
        });
        var $this = this;
        $('img', $this).each(function () {
          if (!this.complete) {
            $(this).bind('load', function() {
              if (++loadedImages == totalImages) {
                setTimeout(function () {
                  Drupal.behaviors.grid_gallery_thumb_strip.applyIScroll(self);
                  grid_gallery_visibility($this, totalImages);
                }, 500);
              }
            });
          }
          else {
            loadedImages++;
          }
        });

        if (loadedImages == totalImages) {
          setTimeout(function () {
            Drupal.behaviors.grid_gallery_thumb_strip.applyIScroll(self);
            grid_gallery_visibility($this, totalImages);
          }, 500);
        }
      });

      var grid_gallery_visibility = function ($this, totalImages) {
        var index = imagesVisable = parseInt($('.thumb-strip').outerWidth() / $('img.grid-gallery__image').outerWidth());
        Drupal.settings.grid_gallery.imagesVisable = imagesVisable;
        Drupal.settings.grid_gallery.imagesCount = imagesVisable;
        // Hide non visable images.
        for (; index < totalImages; index++) {
          $($('img', $this)[index]).parent().css('visibility', 'hidden');
        }
      };
    },

    applyIScroll: function (elem) {
      var wrapper = $(elem).find(".thumb-strip-wrapper"),
        scroller = $(elem).find("ul"),
        thumbs = $(elem).find("li"),
        thumbHeight = thumbs.last().height(),
        scrollerWidth = 0;

      thumbs.each(function() {
        scrollerWidth += 106;
      });
      
      // Safari fix.
      scrollerWidth += 1;

      scroller.css({
        "width": scrollerWidth + "px",
        "height": thumbHeight + "px"
      });

      var scroll = new IScroll(wrapper[0], {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: 'li',
        bounce: false,
        touch: true,
        eventPassthrough: true
      });

      var $elem = $(elem);
      var allList = $elem.find("li");
      var thumbPrev = $elem.find(".thumb-strip-prev");
      var thumbNext = $elem.find(".thumb-strip-next");
      thumbPrev.bind("click", function () {
        scroll.prev();
        // Disabling thumb when no need to slide.
        // Visability of hidden elements.
        Drupal.settings.grid_gallery.countFromStart--;
        $(allList[[Drupal.settings.grid_gallery.countFromStart]]).children().css('visibility', 'visible');
        Drupal.settings.grid_gallery.imagesCount--;
        $(allList[[Drupal.settings.grid_gallery.imagesCount]]).children().css('visibility', 'hidden');

        if (Drupal.settings.grid_gallery.imagesCount <= Drupal.settings.grid_gallery.imagesVisable) {
          $(this).attr("disabled", "disabled");
        }
        else {
          $(this).removeAttr("disabled");
        }
        if (Drupal.settings.grid_gallery.imagesCount >= Drupal.settings.grid_gallery.totalImages) {
          thumbNext.attr("disabled", "disabled");
        }
        else {
          thumbNext.removeAttr("disabled");
        }
      });

      thumbNext.bind("click", function () {
        scroll.next();
        // Disabling thumb when no need to slide.
        // Visability of hidden elements.
        $(allList[[Drupal.settings.grid_gallery.imagesCount]]).children().css('visibility', 'visible');
        Drupal.settings.grid_gallery.imagesCount++;
        $(allList[[Drupal.settings.grid_gallery.countFromStart]]).children().css('visibility', 'hidden');
        Drupal.settings.grid_gallery.countFromStart++;

        if (Drupal.settings.grid_gallery.imagesCount >= Drupal.settings.grid_gallery.totalImages) {
          $(this).attr("disabled", "disabled");
        }
        else {
          $(this).removeAttr("disabled");
        }
        if (Drupal.settings.grid_gallery.imagesCount <= Drupal.settings.grid_gallery.imagesVisable) {
          thumbPrev.attr("disabled", "disabled");
        }
        else {
          thumbPrev.removeAttr("disabled");
        }
      });

      $elem.addClass("loaded");
    }
  }
})(jQuery);
