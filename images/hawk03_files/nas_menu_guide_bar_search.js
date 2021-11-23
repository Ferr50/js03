;(function($){
    Drupal.behaviors.toggleBirdGuideBarSearch = {
        attach: function(context, settings) {
            $(".toggle-bird-guide-search", context).once('bird-guide-search', function() {
                $(this).bind("click", function() {
                    $(".toggle-bird-guide-search", context).toggleClass("open");
                    $(".bird-guide-search", context).toggleClass("show");
                });
            });
        }
    };
})(jQuery);
