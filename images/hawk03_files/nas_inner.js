var Nas = Nas || {};

(function ($) {

  Drupal.behaviors.boaPrevNext = {
    attach: function (context, settings) {
      $(document).bind("respond", function (e) {
        var pagerBlock = $(".boa-family-block-pager.plate");
        if ( pagerBlock.length) {

          var separator = $(".boa-family-block-pager.plate .separator");

          var prevText = $(".boa-family-block-pager.plate .previous-text");
          var prevTitle = $(".boa-family-block-pager.plate .previous-title");
          var prevHeight = 0;
          if (prevTitle.length) {
            prevHeight = prevText.height() + prevTitle.height();
          }
          var nextText = $(".boa-family-block-pager.plate .next-text");
          var nextTitle = $(".boa-family-block-pager.plate .next-title");

          var nextHeight = 0;
          if (nextTitle.length) {
            nextHeight = nextText.height() + nextTitle.height();
          }

          if (prevHeight || nextHeight) {
            var setHeight = Math.max(prevHeight, nextHeight);

            pagerBlock.css("height", setHeight + 100);
            separator.css("height", setHeight + 20);
          }

        }

      });
    }
  };

  // Prevent equalization if stacked.
  Drupal.behaviors.frontpageEqualizer = {
    attach: function (context, settings) {
      $('.homepage-first-row', context).once('frontpage-equalizer', function () {
        var $row = $(this)
          .on('after-height-change.fndtn.equalizer', function (e) {
            if (StateManager.state === '' || StateManager.state == 'tiny' || StateManager.state == 'small') {
              $('[data-equalizer-watch]', $(this)).removeAttr('style');
            }
          })
          .trigger('after-height-change.fndtn.equalizer');
      });
    }
  };

  /**
   * Trigger event "respond" on exiting IPE, fix Widgets.
   */
  Drupal.behaviors.nasEndIPEWidgetFix = {
    attach: function (context, settings) {
      // Climate2 survivalbydegrees range map fix.
      $("body.panels-ipe").on("endIPE", function () {
        if (typeof (Climate2) !== "undefined") {
          Climate2.mountLandingRangeMap('range-map', {speciesCodes: ['BOBO', 'COLO', 'MOBL', 'WOTH']});
        }
        // lang_dropdown fix.
        Drupal.attachBehaviors(document, Drupal.behaviors.nas_language_dropdown);
      });

      //Check if Menu panel and behaviour to be fixed are present.
      if (typeof (Drupal.behaviors.nasMenu) !== "undefined" && $(".panels-ipe-portlet-content").find(".menu-wrapper").length > 0) {
        var width = jQuery("body").width();
        $("html").once().on("endIPE", function () {
          // Menu fix.
          if (width < 480 ) {
            this.state = "tiny";
          } else if (width > 479 && width < 601 ) {
            this.state = "small";
          } else if (width > 600 && width < 768 ) {
            this.state = "medium";
          } else if (width > 767 ) {
            this.state = "large";
          }
          var e = jQuery.Event( "respond", { size: this.state } );
          jQuery(document).trigger(e);
        });
      }
    }
  };

  Drupal.behaviors.nasBirdGuide = {
    attach: function (context, settings) {
      $(".bird-guide-search select").once().change(function (e) {
        var $container = $(".bird-card-grid-container");
        $container.find(".bird-card").addClass("disappear");
        $(".bird-card.disappear").bind("animationend webkitAnimationEnd oanimationend MSAnimationEnd", function () {
          $(this).addClass("invisible");
        });
      });
    }
  };

  Drupal.behaviors.magIssueFeatured = {
    attach: function (context, settings) {
      $(window).bind('load resize', function() {
        var magIssueCoverHeight = $(".node-type-magazine-issue .sidebar-section.editorial-card-photo img").height();
        var magIssueEdBlockHeight = $(".node-type-magazine-issue .editorial-card.collapse-minimal:eq(0)").height();
        if (magIssueEdBlockHeight !== 0 && magIssueEdBlockHeight < magIssueCoverHeight) {
          $(".node-type-magazine-issue .editorial-card.collapse-minimal").css("min-height", magIssueCoverHeight);
        }
      });
    }
  };

  Drupal.behaviors.videoCurtainController = {
    attach: function(context, settings) {
      $('.curtain-video video').once('curtain-video-controller', function () {
        if (navigator && navigator.userAgent && navigator.userAgent !== null) {
          var strUserAgent = navigator.userAgent.toLowerCase();
          var arrMatches = strUserAgent.match(/(iphone|ipod|ipad)/);
          if (arrMatches !== null && document.location.pathname.indexOf('climate/survivalbydegrees') === -1) {
            $('body').addClass('force-curtain-fallback');
          }
        }

        var $video = $(this), video = this;
        var video_manager = setInterval(function () {
          if (video.readyState === 4) {
            video.play();
            clearInterval(video_manager);
          }
        }, 1000);

        $video
          .bind('play', function () {
            $video.fadeIn('slow');
            $('.curtain-video-load-indicator').fadeOut('slow');
          });
      });
    }
  };

  Drupal.behaviors.videoCurtainSizing = {
    attach: function(context, settings) {
      $('.curtain-video.center video, .curtain-video.cover video').once('video-curtain-sizing', function () {
        var $video = $(this);

        this.onloadedmetadata = function (e) {
          var width = $video.width();
          var height = $video.height();
          $video.css({
            marginLeft: -width / 2,
            marginTop: -height / 2
          });
          $(window).trigger('resize');
          $video.fadeIn('slow');
        };
        if ($video.parent().hasClass('cover') || $video.parent().hasClass('center')) {
          $(window).bind('resize', function () {
            var width = $video.width();
            var height = $video.height();
            $video.css({
              marginLeft: -width / 2,
              marginTop: -height / 2
            });
          });
        }
      });
    }
  };

  Drupal.behaviors.bird_in_this_story_see_all = {
    attach: function (context, settings) {
      $('.article-related-birds', context).once('article-related-birds', function () {
        var $this = $(this);
        $('.bits-see-all-controller', $this).click(function () {
          $('.bits-see-all-hide', $this).hide();
          $('.bits-see-all-show', $this).show();
          return false;
        });
      });
    }
  };

  Drupal.behaviors.viewLoadMoreGroupHandler = {
    attach: function (context, settings) {
      $('.view-display-id-boa_listing').once('views-load-more-group-handler', function () {
        $(this).bind('views_load_more.new_content', function (event, new_content) {
          var classes = new_content.className.split(' ');
          var view_dom_id = '';

          // Look up view-dom-id-# class.
          for (var i in classes) {
            var classname = classes[i];
            if (classname.match(/view-dom-id-.*/)) {
              view_dom_id = classname;
              break;
            }
          }
          // Regroup if found.
          if (view_dom_id) {
            var prev_title = '',
              prev_row = false;
            $('.' + view_dom_id).find('.views-row-odd, .views-row-even').each(function () {
              var current_title = $(this).find('.boa-family-set-title').text();
              if (prev_row && current_title == prev_title) {
                $(this).find('.boa-bird-card-container > *').appendTo(prev_row.find('.boa-bird-card-container'));
                $(this).remove();
              }
              else {
                prev_row = $(this);
                prev_title = current_title;
              }
            });
          }
        });
      });
    }
  };

  // Additional behaviour for bird guide page.
  Drupal.behaviors.colorbox_resize = {
    attach: function (context, settings) {
      $(window).on('resize', function(){
        var $colorbox_instance = $('.node-type-bird #colorbox');
        if (typeof $.colorbox != "undefined" && typeof $colorbox_instance != "undefined") {
          var offset = $colorbox_instance.offset();
          if (typeof offset != 'undefined' && offset !== null && typeof offset.left != 'undefined') {
            var colorbox_offset = ($(window).width() - (offset.left + $colorbox_instance.outerWidth()));
            // Resize colorbox when it overlapped.
            if (colorbox_offset < 0) {
              $.colorbox.resize({
                width: Drupal.settings.colorbox.initialWidth
              });
              $colorbox_instance.find('.cboxPhoto').css({
                width: '100%',
                height: '100%'
              });
            }
          }
        }
      });
    }
  };

  // Additional behaviour for Custom Color box output.
  Drupal.behaviors.colorBoxCustom = {
    attach: function (context, settings) {
      const $customColorboxLink = $('.js-colorbox-custom');
      if (typeof $.colorbox != "undefined" && $customColorboxLink) {
        $('.js-colorbox-custom').each(function(){
          $(this).colorbox({
            href: $(this).attr('data-href'),
            maxWidth: "80%",
            maxHeight: "90%",
            initialWidth: "80%",
            initialHeight: "90%",
          });
        })
      }
    }
  };

  Drupal.behaviors.boaPlateViewLoadMore = {
    attach: function (context, settings) {
      var boa_plates_wrapper = $('.boa-plate-view-wrapper');
      $('.view-nas-bird-guide .pager-load-more a.load-more', boa_plates_wrapper).once('views-load-more-boa-plate-handler').click(function() {
        $('.icon-binoculars', boa_plates_wrapper).hide();
      });
    }
  };

  Drupal.behaviors.preventBouncing = {
    attach: function (context, settings) {
      $('.aid-filter .toggler').bind('click touchend', function (e) {
        e.preventDefault();
        var $this = $(this);
        $(".primary-nav-toggler").not($this).removeClass("open");
        $(".primary-sub-nav").not($this.next(".primary-sub-nav")).removeClass("show");

        $this.toggleClass("open");
        $this.next(".primary-sub-nav").toggleClass("show");

        setTimeout(function () { // this is just a "next tick"
          if (window.scrollY > $this.offset().top) {
            window.scrollTo(0, $this.offset().top);
          }
        }, 0);
      });
    }
  };

  Drupal.behaviors.fieldGuide = {
    attach: function (context, settings) {
      if ($('body').hasClass('page-field-guide')) {
        $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
          if (options.url.match("\/views\/ajax")) {
            options.url = options.url.replace(/\/views\/ajax\?page=\d&?/g, '/views/ajax?');
          }
        });
        $(document).ajaxComplete(function(event, xhr, settings) {
          var updated_url = '';
          // change the URL after a new content is loaded.
          if (settings.url.match("\/field-guide\\?page=")) {
            updated_url = settings.url;
          }
          if (settings.url.match("\/views\/ajax")) {
            var data = settings.data.split('&').slice(0, 3).join('&');
            updated_url = window.location.pathname + '?' + data;
          }
          if (updated_url !== '') {
            window.history.replaceState('', '', updated_url);
          }
        });
        // Additionatly change page number after bird is clicked.
        $('.bird-card a').bind('click touchend', function (e) {
          var id = parseInt($(this).parents('.views-row').attr('class').split(' ')[0].replace('page-', '')),
            page_numb_replace = 'page=' + id,
            page_regexp_replace = /page=\d+/g;
          if (id === 0) {
            page_numb_replace = '';
            page_regexp_replace = /page=\d+&?/g;
          }
          var updated_url = window.location.pathname + window.location.search.replace(page_regexp_replace, page_numb_replace);
          window.history.replaceState('', '', updated_url);
        });
      }
    }
  };

  Drupal.behaviors.NewsPage = {
    attach: function (context, settings) {
      if ($('body').hasClass('page-news') || ($('body').hasClass('page-taxonomy-term-tags'))) {
        $(document).ajaxComplete(function(event, xhr, settings) {
          var updated_url = '';
          // change the URL after a new content is loaded.
          if (settings.url.match("\\?page=")) {
            updated_url = settings.url;
          }
          if (updated_url !== '') {
            window.history.replaceState('', '', updated_url);
          }
        });
        // Additionatly change page number after links is clicked.
        $('.view-nas-news a').bind('click touchend', function (e) {
          var id = parseInt($(this).parents('.views-row').attr('class').split(' ')[0].replace('page-', '')),
            page_numb_replace = 'page=' + id,
            page_regexp_replace = /page=\d+/g;
          if (id === 0) {
            page_numb_replace = '';
            page_regexp_replace = /page=\d+&?/g;
          }
          var updated_url = window.location.pathname + window.location.search.replace(page_regexp_replace, page_numb_replace);
          window.history.replaceState('', '', updated_url);
        });
      }
    }
  };

  Drupal.behaviors.noImage = {
    attach: function (context, settings) {

      $(window).on("load resize",function(e){
        titlePosition();
      });

      function titlePosition(){
        var $selector = $('.view-display-id-articles_term_10 .tiny-8'),
          $position = $selector.position();
        if (typeof $position !== 'undefined' && $position !== null){
          var lleft = $position.left;
          lleft = parseInt(lleft);
          var pleft = $selector.css('padding-left').replace(/[^-\d\.]/g, '');
          pleft = parseInt(pleft);
          $('.tiny-12').css({'left': lleft+pleft, 'width': '66%'});
        }
      }
    }
  };

  Drupal.behaviors.centerAuthorImage = {
    attach: function (context, settings) {
      articleAuthor = jQuery(".article-sidebar-section.article-meta img");
      if(articleAuthor.length) {
        jQuery(".article-sidebar-section.article-meta").css("text-align","center");
      }
    }
  };

  Drupal.behaviors.search_highlight = {
    attach: function (context, settings) {
      $('.page-search-results').each(function(){
        var query = {},
          queries = window.location.search.substring(1).split('&'),
          qr_length = queries.length,
          highlight = ['.common-name a', '.scientific-name', '.editorial-card-title a', '.editorial-card-content p', '.editorial-card-info a'],
          hl_length = highlight.length,
          i = 0,
          highlight_aplly = function(){
            var sr_length = query.search.length,
              j = 0;
            for (j = 0; j < sr_length; j = j + 1) {
              $(this).highlight(query.search[j], { caseSensitive: false });
            }
          };

        // Retrieving the search words from URL.
        for (i = 0; i < qr_length; i = i + 1) {
          queries[i] = queries[i].split('=');
          if (queries[i][0] == 'search') {
            query[queries[i][0]] = queries[i][1].split('+');
          }
          else {
            query[queries[i][0]] = queries[i][1];
          }
        }
        if ($.isArray(query.search)) {

          // Iterate over all strings container and highlight search words.
          for (i = 0; i < hl_length; i = i + 1) {
            $(highlight[i]).each(highlight_aplly);
          }
        }
        $('.highlight').css('background-color', 'yellow');
        $('.highlight').css('color', 'black');
      });
    }
  };

  Drupal.behaviors.iframe_map = {
    attach: function (context,settings){
      var map = $("#map-canvas iframe");
      parent_h = map.parent().height();
      map_h = map.height();
      if(parent_h < map_h){
        map.parent().height(map_h);
      }
      else{
        map.height(parent_h);
      }
    }
  };

  Drupal.behaviors.flyways_slider_megamap_integration = {
    attach: function(context, settings) {
      var flyways = ['#pacific-flyway-slide', '#central-flyway-slide', '#mississippi-flyway-slide', '#atlantic-flyway-slide'];
      $('.flyway-megamap-point, .flyway-path-dots a').once().click(function(e) {
        var id = $(this).attr('id');
        if (!id) {
          id = $(this).attr('href');
        }
        var number = parseInt(id.charAt(id.length-1));
        e.preventDefault();
        $('.flyway-slide.current').removeClass('current');
        $('.flyway-slide-button.current').removeClass('current');
        $(flyways[number-1]).addClass('current');
        $('.flyway-slide-button[href='+flyways[number-1]+']').addClass('current');
      });
      $('.flyway-slides-paddle, .flyway-slide-button').once().click(function(e) {
        var number = $('.flyway-slide-button.current').parent().index() + 1;
        $('a[href="#flyway-map-' + number + '"]').click();
      });
    }
  };

  Drupal.behaviors.mobileHeaderImageResize = {
    attach: function(context, settings) {
      $('.hero').once('mobile-header-image-resize', function () {
        var $self = $(this);
        var mobile_image = $self.find('img.hide-for-large');
        var header = $self.find('.hero-header');
        $(window).resize(function() {
          if (mobile_image.is(':visible')) {
            mobile_image.css({height: '', maxWidth: '100%'});
            if (header.height() + 40 > mobile_image.height()) {
              mobile_image.css({
                height: header.height() + 40,
                maxWidth: 'none'
              });
            }
          }
        });
      });
    }
  };

  Drupal.behaviors.fullVideo = {
    attach: function(context, settings) {
      if ($(context).find('.article-video-container.full').length) {
        $(window).bind("resize", function () {
          var $body = $('body');
          var $video = $(".article-video-container.full");
          if (!$video.length) {
            return;
          }

          var body_width = $body.width();
          $video.removeAttr('style');
          var diff_width = body_width - $video.width();
          var margin = 0;
          if (diff_width > 0) {
            margin = diff_width / 2;
          }
          var negative_margin = margin * (-1);
          $video.css({
            width: body_width,
            "text-align": "center",
            'margin-left': negative_margin,
            'margin-right': negative_margin
          });
          if ($video.offset().left !== 0) {
            $video.css({
              'margin-left': (margin + $video.offset().left) * (-1),
              'margin-right': (margin - $video.offset().left) * (-1)
            });
          }
        });
      }
    }
  };

  Drupal.behaviors.articleColumnsHeight = {
    attach: function (context, settings) {
      var img = $('.article-text>.article-image.slideshow-mimic-image, .article-text>.slideshow');
      if (img.length) {
        setColumnsHeight();
        var time;
        $(window).on('resize', function () {
          clearTimeout(time);
          time = setTimeout(setColumnsHeight, 200);
        });

        function setColumnsHeight() {
          var right = $('.article-aside')
            , left = $('.article-sidebar');
          if (left.length && right.length) {
            if (img[0].offsetTop <= $(left).height()) {
              $(right).css({'min-height': $(left).height()});
            }
            else {
              $(right).css({'min-height': 'auto'});
            }
          }
        }
      }
    }
  };

  Drupal.behaviors.videoVimeo = {
    attach: function (context, settings) {
      var $video = $('.article-header iframe[src*="player.vimeo.com"], .article-body iframe[src*="player.vimeo.com"]')
        , videoRatio;
      if (!$video.length) {
        return;
      }
      $video.each(function () {
        $width = parseInt(this.width)
        $height = parseInt(this.height)
        if ($width > $height) {
          videoRatio = $height / $width;
        } else if ($height > $width) {
          videoRatio = $width / $height;
        } else {
          videoRatio = 1
        }
        $(this).wrap("<div class='video-vimeo'></div>");
        $(this).parent()
          .addClass('video-ratio')
          .css({"padding-bottom": videoRatio * 100 + '%'})
      });
      var $wrappedVideo = $('.nas-article-default-layout .article-header .video-vimeo, .nas-article-default-layout .article-body .video-vimeo');
      if ($wrappedVideo.length) {
        $wrappedVideo.each(function () {
          var $this = $(this);
          var topOffset = $this.offset().top;
          var $parent = $this.parent();
          $parent.before("<div class='embed-container-placeholder'></div>");
          $this.css('top', topOffset);
          $this.css('width', '100%');
          $this.css('position', 'absolute');
          $(document.body).append($this.context);
          setTimeout(() => {
            // Wait a little after placement complete.
            $parent.siblings('.embed-container-placeholder').css('height', $this.innerHeight());
            $parent.remove();
          }, 1);
        });
        var videoVimeoAspectRation = function() {
          $videos = $('.video-vimeo.video-ratio');
          $placeholders = $('.embed-container-placeholder');
          for (var index = 0; index <  $videos.length; index++) {
            var $video = $($videos[index]);
            var $placeholder = $($placeholders[index]);
            $placeholder.css('height', $video.innerHeight());
            $video.css('top', $placeholder.offset().top);
          }
        };
        $(window).resize(function () {
          videoVimeoAspectRation();
        });
      }
    }
  };

  Drupal.behaviors.nasGridGalleryDivMove = {
    attach: function (context, settings) {

      var grid_galley_div = $('#grid-gallery')

      if (grid_galley_div) {

        Drupal.settings.nasGridGallery = {};
        Drupal.settings.nasGridGallery.withoutAnlternative = true;

        $('body').append(grid_galley_div)
      }
    }
  }

  Drupal.behaviors.i18n_pc = {
    attach: function (context, settings) {
      // If Pannel Ipe lock page from which translation will be made
      // it will erase all original page content.
      if ($("body").hasClass("logged-in")) {
        $(".i18n_translation_add_button").on("click", function(){
          $("#panels-ipe-cancel").click();
        });
        $(".i18n_translation_add_button").ready(function() {
          // Function gives an opportunity to bind ctools modals links.
          // @see https://www.drupal.org/project/ctools/issues/2030197
          // Reattach ctools modal.
          Drupal.behaviors.ZZCToolsModal.attach(".i18n_translation_add_button");
        });
      }
    }
  };

})(jQuery);
