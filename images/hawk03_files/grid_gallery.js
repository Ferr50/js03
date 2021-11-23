;(function ($) {
  Drupal.behaviors.grid_gallery = {
    attach: function (context, settings) {
      $('.grid-gallery .grid-gallery__lightbox', context).each(function() {
        $(this).attr('data-gallery', '#grid-gallery');
      });

      if (context == document) {
        var links = $('[data-gallery="#grid-gallery"]');
        var slide_index = window.location.hash.substring(6);
        if (!isNaN(slide_index) && slide_index !== '' && $(window).width() >= 600) {
          setTimeout(function() {
            $(links.get(slide_index - 1)).trigger('click');
          }, 100);
        }
      }

      var waitingSlide = false;
      var lastSlide = false;

      // Workaround for mobile description scrolling.
      var prevEventCoords = null;
      $('.nas-blueimp-gallery .description .title-wrapper').on('touchstart touchend touchmove', function(e) {
        if (e.type == 'touchmove') {
          e.preventDefault();
        }
        if (typeof e.originalEvent.touches[0] != 'undefined') {
          var $target = $(this).find('.title-wrapper-inner');
          var curEventCoords = {
            screenX: e.originalEvent.touches[0].screenX,
            screenY: e.originalEvent.touches[0].screenY
          };
          if (prevEventCoords != null && e.type == 'touchmove') {
            var cst = $target.scrollTop();
            var delta = curEventCoords.screenY - prevEventCoords.screenY;
            $target.scrollTop(cst - delta);
          }
          prevEventCoords = curEventCoords;
        }
      });
      
      var backTo = null;

      $('#grid-gallery', context)
        .on('open', function (event) {
          backTo = $(document.activeElement);
          // Gallery open event handler
          $('html').css('overflow-y', 'initial');
          var classes = $(this)[0].classList.value;
          openDialog('grid-gallery', this);
          $(this).removeClass('default_dialog').addClass(classes);
          if (typeof aria !== 'undefined' && typeof aria.handleEscape !== 'undefined') {
            document.removeEventListener('keyup', aria.handleEscape);
          }
          $('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]):not(.grid-gallery-button), details,summary, iframe, object ,embed, [contenteditable]').each(function(){
            self = $(this);
            if (self.is('[tabindex]')) {
              self.attr('data-tabindex', self.attr('tabindex'));
            }
            self.attr('tabindex', -1);
          });
          $('body > *').each(function(){
            self = $(this);
            if (!self.hasClass('dialog-backdrop')
            && !self.hasClass('nas-blueimp-gallery')) {
              if (self.is('[aria-hidden]')) {
                self.attr('data-aria-hidden', self.attr('aria-hidden'));
              }
              self.attr('aria-hidden', true);
            }
          });
          $('#grid-gallery').attr('aria-hidden', 'false');

          var img_title = $(backTo.context).find('.grid-gallery__image').data('title');
          if (img_title.length > 0) {
            $('#grid-gallery-label').text(img_title);
          }
        })
        .on('opened', function (event) {
          // Gallery opened event handler
          var gallery = $("#grid-gallery").data('gallery');
          $('#grid-gallery .slide', context).each(function() {
            resize_slide(this, $(this).data('index') == gallery.index);
          });
          $('#grid-gallery').attr('aria-hidden', 'false');
          $('.nas-blueimp-gallery button.close').focus();
        })
        .on('slide', function (event, index, slide) {
          // Gallery slide event handler
          // Hide all slides, only one visable at time.
          $(this).find('.slide').css('visibility', 'hidden');
          $(slide).css('visibility', 'visible');
          var gallery = $(event.target).data('gallery');
          var total = (index + 1) + ' of ' + gallery.list.length;
          gallery.container.find('.total').text(total);
          var $credit = gallery.container.find('.credit');
          $credit.text($(gallery.list[index]).find('img').data('credit') || '');
          // Reset scroll top on slide.
          gallery.container.find('.title-wrapper-inner').scrollTop(0);

          var $title = gallery.container.find('.title');
          var titleText = $(gallery.list[index]).find('img').data('title');
          if (titleText.length > 0) {
            $('#grid-gallery-label').text(titleText);
          }
          else {
            $('#grid-gallery-label').text(Drupal.t('Bird'));
          }
          if ($(gallery.list[index]).find('img').data('show_cc_for_sc') == false) {
            $('#grid-gallery-label').attr('aria-hidden', true);
            $title.attr('aria-hidden', true);
            $credit.attr('aria-hidden', true);
          }
          else {
            $('#grid-gallery-label').attr('aria-hidden', false);
            $title.attr('aria-hidden', false);
            $credit.attr('aria-hidden', false);
          }
          $(slide).children().eq(0).attr('alt', titleText ?? Drupal.t('Bird'));
          var $description = gallery.container.find('.description');
          $title.stop().animate({opacity:0}, 200, function() {
            $title.html(titleText);
            $description.find('.title').parents('.title-wrapper').removeClass('overlay');
            if (!$(slide).hasClass('slide-loading')) {
              waitingSlide = false;
              if (index == lastSlide) return;
              lastSlide = index;
              resize_slide(slide, true);
            }
            else {
              waitingSlide = index;
            }
          });
        })
        .on('slideend', function (event, index, slide) {
          // Gallery slideend event handler
          window.history.replaceState(null, null, '#photo' + (index + 1));
        })
        .on('slidecomplete', function (event, index, slide) {
          // Gallery slidecomplete event handler
          if (waitingSlide === index) {
            waitingSlide = false;
            resize_slide(slide, true);
          }
        })
        .on('close', function (event) {
          // Gallery close event handler
          window.history.replaceState(null, null, '#');
          $('html').css('overflow-y', 'scroll');

          $('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]):not(.grid-gallery-button), details,summary, iframe, object ,embed, [contenteditable]').each(function(){
            self = $(this);
            if (self.is('[data-tabindex]')) {
              self.attr('tabindex', self.attr('data-tabindex'));
              self.removeAttr('data-tabindex');
            }
            else {
              self.removeAttr('tabindex');
            }
          });
          $('body > *').each(function(){
            self = $(this);
            if (!self.hasClass('dialog-backdrop')
            && !self.hasClass('nas-blueimp-gallery')) {
              if (self.is('[data-aria-hidden]')) {
                self.attr('aria-hidden', self.attr('data-aria-hidden'));
                self.removeAttr('data-aria-hidden');
              }
              else {
                self.removeAttr('aria-hidden');
              }
            }
          });
        })
        .on('closed', function (event) {
          // Gallery closed event handler
          if (backTo != null) {
            backTo.focus();
          }
          $('.dialog-backdrop.active > div[tabindex="0"]').remove();
          $('#grid-gallery').attr('aria-hidden', 'true');
        });

      $(window).on('resize', function () {
        var gallery = $("#grid-gallery").data('gallery');
        $('#grid-gallery .slide', context).each(function() {
          resize_slide(this, $(this).data('index') == gallery.index);
        });
      });

      var resize_description = function (event, index, slide) {
        var gallery = $(event.target).data('gallery');
        var $description = gallery.container.find('.description');
        var $title = $description.find('.title');
        var image_width = Math.max($(slide).find('img').width(), 320);
        var margin = ($(window).width() >= 480 && $(window).width() <= 1020) ? 25 : 12.5;
        var padding = Math.max(($(window).width() - image_width) / 2 - margin, 0);
        $description
          .css({
            paddingLeft: padding,
            paddingRight: padding
          });

        setTimeout(function () {
          if ($title.outerHeight() > $title.parent().outerHeight()) {
            $title.parents('.title-wrapper').addClass('overlay');
          }
        }, 100);
        gallery.container.find('.title').animate({opacity:1}, 400);
      };

      // Handle landscape pictures.
      var resize_slide = function (slide, current_slide) {
        var $img = $(slide).find('img');
        if ($img.size() == 0) {
          return;
        }
        var image_dimensions = {
          width: $img.width(),
          height: $img.height()
        };
        var slide_dimensions = {
          width: $(slide).width(),
          height: $(slide).height()
        };
        var image_aspect_ratio = image_dimensions.width / image_dimensions.height;
        var slide_aspect_ratio = slide_dimensions.width / slide_dimensions.height;

        var is_alternative = false;
        if (current_slide) {
          var alw = window.innerWidth - 25;
          if (window.innerWidth > 1000) {
            alw = window.innerWidth - 100;
          }
          else if (window.innerWidth > 800) {
            alw = window.innerWidth - 25 - 75 * (window.innerWidth - 800) / 200;
          }
          var maximum_allowed = {
            height: window.innerHeight,
            width: alw
          };
          var minimum_description_width = 320;

          var eff_height = maximum_allowed.height - 96 - parseInt($('.slides').css('padding-top'));
          var eff_width = eff_height * image_aspect_ratio;

          if(typeof Drupal.settings.nasGridGallery === 'undefined'
           || typeof Drupal.settings.nasGridGallery.withoutAnlternative === 'undefined') {
            console.log(111);
            if (eff_width > maximum_allowed.width - minimum_description_width) {
              $('.nas-blueimp-gallery').removeClass('nas-blueimp-gallery-alternative');
            }
            else {
              is_alternative = true;
              $('.nas-blueimp-gallery').addClass('nas-blueimp-gallery-alternative');
              image_dimensions = {
                width: $img.width(),
                height: $img.height()
              };
              $('.title-wrapper-alternative').css({
                marginLeft: (image_dimensions.width - minimum_description_width) / 2,
                maxHeight: image_dimensions.height,
                overflow: 'auto'
              });
            }
          }
        }

        $(slide).find('img').removeClass('slide-content-landscape');
        if (!is_alternative && image_aspect_ratio > slide_aspect_ratio) {
          $(slide).find('img').addClass('slide-content-landscape');
        }

        if (current_slide) {
          resize_description({target: '#grid-gallery'}, 0, slide);

          if ($(slide).next('.slide')) {
            resize_slide($(slide).next('.slide'), false);
          }
          if ($(slide).next('.slide').next('.slide')) {
            resize_slide($(slide).next('.slide').next('.slide'), false);
          }
          if ($(slide).prev('.slide')) {
            resize_slide($(slide).prev('.slide'), false);
          }
        }
      };

      // Make links available for interaction with enter.
      $('#grid-gallery.nas-blueimp-gallery').keydown(function (e) {
        if(e.keyCode == 13) {
          $(e.target).click();
          return false;  
        }
      });
    }
  };
})(jQuery);
