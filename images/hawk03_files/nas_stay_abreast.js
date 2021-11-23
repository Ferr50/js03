(function ($) {
  Drupal.behaviors.stayAbreastEveryActionForm = {
    attach: function (context, settings) {
      $("body").once("stay-abreast-every-action-form", function(){
        var everyactionStayAbreastId = Drupal.settings.nasEveryAction.stay_abreast;
        Drupal.includeEveryActionScript();

        window.nvtag_callbacks = window.nvtag_callbacks || {};
        var nvtag_callbacks = window.nvtag_callbacks;
        var alterFill = function (args) {
          var form = jQuery("#NVSignupForm" + everyactionStayAbreastId);
          if(!form.length){
            return args;
          }
          form.find(".EmailAddress input").attr("placeholder", Drupal.t("Enter your email address"));
          form.find(".EmailAddress input").attr("aria-label", Drupal.t("To sign up to our email newsletter with the latest programs and initiatives"));
          form.find(".at-submit").attr("value", Drupal.t("Sign Up")).css("height", "auto");
          form.find(".at-inner > .at-title").remove();
          form.find(".at-inner > .FooterHtml").remove();
          return args;
        };
        nvtag_callbacks.alterFill = nvtag_callbacks.alterFill || [];
        nvtag_callbacks.alterFill.push(alterFill);
      });
    }
  };
})(jQuery);
