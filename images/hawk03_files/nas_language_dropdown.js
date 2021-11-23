(function ($) {
  Drupal.behaviors.nas_language_dropdown = {
    attach: function (context, settings) {
      var lang_main_class = ".nas-language-dropdown";
      var first_button = $(".nas-language-dropdown .nas-language-dropdown-button:first-of-type");
      var second_button = $(".nas-language-dropdown .nas-language-dropdown-button:last-of-type");
      // First lang.
      first_button.once('nld').on("click", function(e) {
        e.stopPropagation();
        var nas_language_dropdown = $(this).closest(lang_main_class);
        if (nas_language_dropdown.hasClass("opened")) {
          nas_language_dropdown.removeClass("opened");
          $(this).trigger('blur');
        }
        else {
          nas_language_dropdown.addClass("opened");
        }
      });
      // Second lang.
      second_button.once('nld').on("click", function() {
        var self = $(this);
        var href = self.val();
        self.closest(lang_main_class).removeClass("opened");
        self.siblings(".nas-language-dropdown-button").html(self.html());

        if (href.indexOf('?') != -1) {
          href = href.substring(0, href.indexOf('?'));
          window.location.href = href;
        }
        else {
          window.location.href = href;
        }
      });
      // Click outside of nas-lang-dropdown.
      $(lang_main_class).once('nld').on("focusout", function(e) {
        if ($(e.relatedTarget).is(".nas-language-dropdown .nas-language-dropdown-button") === false) {
          $(lang_main_class).removeClass("opened");
        }
      });
      // Add tabindex -1 for second menu nas-lang-dropdown because of cache.
      var curtain_lang_dropdown = $('.curtain-wrapper .nas-header-lang-dropdown .nas-language-dropdown-button');
      curtain_lang_dropdown.attr('tabindex', -1);
      curtain_lang_dropdown.attr('aria-hidden', 'true');
    }
  };
})(jQuery);
