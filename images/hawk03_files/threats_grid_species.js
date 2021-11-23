(function($) {

  var urlParams = new URLSearchParams(window.location.search);
  var speciesCode = Drupal.settings.nas_pane.climate2_species_threats_species_code || urlParams.get('speciesCode') || 'MOBL';

  Climate2.mountThreatGrid('threats-grid-species', { speciesCode });

})(jQuery);
