/**
 * Nvtag callbacks.
 */
var nvtag_callbacks = nvtag_callbacks || {}
  , everyactionEngagementCardsId = Drupal.settings.nasEveryAction.engagement_cards;

var alterFill = function (args) {
  var form = jQuery('div[id="NVSignupForm' + everyactionEngagementCardsId + '"]');
  if(!form.length){
    return args;
  }
  form.find('.EmailAddress input').attr('placeholder', 'Enter your email address');
  form.find('.EmailAddress input').attr('aria-label', 'To let us send you the latest in bird and conservation news');
  form.find('.at-submit').attr('value', 'Sign Up');
  form.find('.at-inner > .at-title').remove();
  form.find('.at-inner > .FooterHtml').remove();
  return args;
};
nvtag_callbacks.alterFill = nvtag_callbacks.alterFill || [];
nvtag_callbacks.alterFill.push(alterFill);
