(function ($) {
    Drupal.behaviors.climate2SearchSimpleForm = {
        attach: function (context, settings) {
            var $throbber = $('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div></div>');
            var $zipCodeField = $('#climate2_search_simple_zipcode');
            var $stateField = $('#climate2_search_simple_state');
            var $formRow = $('#climate2_search_simple_zipcode').closest('.form_row');
            var $climate2SearchLocationForm = $('#climate2-search-simple-form');
            var is_en_page = Drupal.settings.nas_pane.lang == 'en';

            // Clear value to use select2 placeholder
            $stateField.find('option:eq(0)').val('');
            $stateField.select2({
                placeholder: Drupal.t("State"),
                allowClear: true
            });

            $climate2SearchLocationForm.on('click', function() {
                clearClimate2SearchErrors();
            });

            $zipCodeField.on('input', function(e) { $stateField.val(null).trigger('change', {fromCode: true}); });
            $stateField.on('change', function(e) { if (e.target.value) $zipCodeField.val(''); });

            $climate2SearchLocationForm.on('submit', function(e) {
                e.preventDefault();
                clearClimate2SearchErrors();
                var $this = $(this);
                var $secondRow = $('#climate2_search_simple_zipcode').closest('.form_row');
                var data = {};

                if (!validateClimate2SearchForm()) return false;

                $this.find('.form-button').prop('disabled', true);

                if ($zipCodeField.val()) {
                    data['search'] = $zipCodeField.val().trim();
                    data['zipcode'] = $zipCodeField.val();
                }
                else if ($stateField.val()) {
                    data['search'] = $stateField.val();
                    data['state_search'] = 1;
                }

                /** @todo moved to stamen for fast response
                 *  use location_search_validate() to get country and state code in url */
                if (data['state_search']) {
                    e.preventDefault();
                    var url_prefix = is_en_page ? '/climate/survivalbydegrees/state/' : '/es/climatico/supervivenciaporgrados/estado/';
                    window.location = url_prefix + getCountryCodeByState($stateField) + '/' + data['search'].toLowerCase();
                } else {
                    $secondRow.append($throbber);

                    var path = Drupal.settings.nas_pane.climate2_base_url + '/administrative-divisions/zip-codes/' + data['zipcode'];
                    $.ajax({
                        method: 'get',
                        data: data,
                        url: path,
                        success: function(resp) {
                            $throbber.remove();
                            $this.find('.form-button').prop('disabled', false);
                            var url_prefix = is_en_page ? '/climate/survivalbydegrees/county' : '/es/climatico/supervivenciaporgrados/condado';
                            window.location = url_prefix + '?zipCode=' + data['zipcode'];
                        },
                        error: function(resp) {
                            $this.find('.form-button').prop('disabled', false);
                            $throbber.remove();

                            if (resp.status == 404) {
                                showError(Drupal.t('Enter a valid 5 digit US zip code.'));
                            } else {
                                console.log(resp);
                                showError(Drupal.t('An error occurred. Please try your search again.'));
                            }
                        }
                    });
                }
            });

            function clearClimate2SearchErrors() {
                $climate2SearchLocationForm.find('.error-text').remove();
            }

            function validateClimate2SearchForm() {
                var zipCode = $zipCodeField.val().trim();
                var state = $stateField.val();

                if (!state && !zipCode) {
                    showError(Drupal.t('Search by Zip Code or State/Province'));
                    return false;
                }

                if (zipCode && !/^\d{5}$/.test(zipCode)) {
                    showError(Drupal.t('Enter a valid 5 digit US zip code'));
                    return false;
                }
                if (zipCode >= 96701 && zipCode < 96797) {
                    showError(Drupal.t('Information for Hawaii is not included in this report'));
                    return false;
                }

                return true;
            }

            function showError(text) {
                $formRow.append('<span class="error-text">' + text + '</span>');
            }

            function getCountryCodeByState($stateField) {
              var select = $stateField.get(0);
              if (!select.selectedIndex || !$stateField.find('optgroup').length) return 'us';

              var label = select.options[select.selectedIndex].parentNode.label;
              switch(label.toLowerCase()) {
                case 'canada': return 'ca';
                case 'mexico': return 'mx';
                default: return 'us';
              }
            }
        }
    };
})(jQuery);