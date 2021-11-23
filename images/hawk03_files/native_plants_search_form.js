(function ($) {
  Drupal.behaviors.npSearchForm = {
    attach: function (context, settings) {
      if (typeof settings.npSearchForms !== 'undefined') {
        for (var formName in settings.npSearchForms) {

          if(!settings.npSearchForms[formName].hasOwnProperty('path')
              || !settings.npSearchForms[formName].hasOwnProperty('id')
          ) {
            continue;
          }

          var $element = $("#" + settings.npSearchForms[formName].id + "-wrapper");
          if ($element.length
              && !$element.hasClass('processed')
          ) {
            var script = document.createElement('script');
            script.setAttribute('src', settings.npSearchForms[formName].path);
            script.setAttribute('id', settings.npSearchForms[formName].id);
            //document.body.appendChild(script);
            $element[0].appendChild(script);
            $element[0].setAttribute('class', $element[0].getAttribute('class') + ' processed');
          }
        }
      }
    }
  };
})(jQuery);
