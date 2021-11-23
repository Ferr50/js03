(function($) {

Climate2.setConfig({
  baseURL: Drupal.settings.nas_pane.climate2_base_url,
  mapboxApiAccessToken: Drupal.settings.nas_pane.climate2_mapbox_api_access_token,
  mapboxMercatorRangeMapStyle: "mapbox://styles/audubon/ck0zmdu7804xb1cml7qkvk94w",
  mapboxNeighboringCountriesSource: 'mapbox://audubon.6z5ibtxa',
  mapboxUSStatesSource: 'mapbox://audubon.bmp62gim',
  mapboxUSCountiesSource: 'mapbox://audubon.3m6llwpe',
  mapboxThreats15Source: 'mapbox://audubon.6uqpq1ck',
  mapboxThreats30Source: 'mapbox://audubon.awuc87hi',
  mapboxAlbersRangeMapStyle: "mapbox://styles/audubon/ck0zffoxy1a881cs96ab5l3uk",
  mapboxOperationalLayersPrefix: 'mapbox://audubon',
});

// Climate widget fields.
Climate2.changeLanguage(Drupal.settings.nas_pane.lang);
if (Drupal.settings.nas_pane.legend_rangeAnswer &&
    Drupal.settings.nas_pane.legend_rangeAnswer.length != 0) {
  Climate2.setStrings(Drupal.settings.nas_pane.lang, {
    rangeMap: {
      legend: {
        rangeAnswer: Drupal.settings.nas_pane.legend_rangeAnswer,
      },
    },
  });
}
if (Drupal.settings.nas_pane.deltaSelector_temperaturesAnswer &&
    Drupal.settings.nas_pane.deltaSelector_temperaturesAnswer.length != 0) {
  Climate2.setStrings(Drupal.settings.nas_pane.lang, {
    deltaSelector: {
      temperaturesAnswer: Drupal.settings.nas_pane.deltaSelector_temperaturesAnswer,
    },
  });
}
if (Drupal.settings.nas_pane.seasonSelector_seasonAnswer &&
    Drupal.settings.nas_pane.seasonSelector_seasonAnswer.length != 0) {
  Climate2.setStrings(Drupal.settings.nas_pane.lang, {
    seasonSelector: {
      seasonAnswer: Drupal.settings.nas_pane.seasonSelector_seasonAnswer,
    },
  });
}


})(jQuery);
