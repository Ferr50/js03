/**
 * @file
 * Javascript refinements for the Bird Guide page.
 */

(function ($) {
  Drupal.behaviors.birdGuideFilters = {
    attach: function (context, settings) {
      $(".bird-guide-exposed-form", context).once('bird-guide-filter', function () {
        var form = this;
        var $input = $('.tt-enable', form).not('.tt-hint');
        $('[name="field_bird_family_tid"], [name="field_bird_region_tid"]', form).bind('change', function () {
          var ac;
          if ($input.hasClass("tt-menu-search") ) {
            ac = Drupal.settings.typeahead.settings["typeahead_menu"];
          } else {
            ac = Drupal.settings.typeahead.settings[$input.attr('id')];
          }
          // Reinitialize all datasets.
          for (var i in ac) {
            ac[i].Bloodhound.clear();
            ac[i].Bloodhound.initialize(true);
          }
        });
        // Suggestion was selected.
        $input.bind('typeahead:selected', function (e, obj, dataset) {
          // If species selected.
          if (dataset == 'species') {
            window.location.href = obj.alias;
          }
          // If family selected.
          else if (dataset == 'families') {
            // Clear input.
            $input.typeahead('val', '');
            $('[name="field_bird_family_tid"]', form).val(obj.tid).trigger('change');
          }
        });
      });
    },
    // Local callback for Bloodhound.
    birdGuideFilteredResults: function (element, settings) {
      var $form = $(element).parents('.bird-guide-exposed-form');
      var family_filter = $('[name="field_bird_family_tid"]', $form).val();
      var region_filter = $('[name="field_bird_region_tid"]', $form).val();

      if (family_filter === undefined) {
        family_filter = "All";
      }
      if (region_filter === undefined) {
        region_filter = "All";
      }
      var values = $(settings.values).filter(function (index) {
        var satisfy_family = family_filter == 'All' || family_filter == this.bfs || typeof this.tid != 'undefined';
        var satisfy_region = region_filter == 'All' || $.inArray(region_filter, this.rgs) != -1;
        return satisfy_family && satisfy_region;
      });

      return $.map(values, function (obj) {
        return obj;
      });
    }
  };
})(jQuery);
