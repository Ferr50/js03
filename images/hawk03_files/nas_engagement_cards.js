(function ($) {

  Drupal.behaviors.engagementCardsEveryActionForm = {
    attach: function (context, settings) {
      $('body').once("engagement-cards-every-action-form", function () {
        Drupal.addAssets('script', Drupal.settings.basePath + 'sites/all/modules/custom/nas_engagement_cards/js/nas_engagement_cards_everyaction.js');
        Drupal.includeEveryActionScript()
      });
    }
  };

})(jQuery);
