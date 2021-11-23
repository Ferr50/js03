(function($) {
  var urlParams = new URLSearchParams(window.location.search);
  var speciesCode = Drupal.settings.nas_pane.climate2_species_range_species_code || urlParams.get('speciesCode') || 'MOBL';
  var adm1 = urlParams.get('adm1');
  var country = urlParams.get('country') || 'US';
  var zipCode = urlParams.get('zipCode');

  Climate2.mountSpeciesRangeMap('range-map-species', { speciesCode, country, adm1, zipCode });
})(jQuery);
