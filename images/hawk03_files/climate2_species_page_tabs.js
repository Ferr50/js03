$(function() {
    var highlitedClass = 'species-page-tab--highlighted';
    var speciesHeight = $('.species-page-tabs__inner-container').height() + $('#admin-menu').height();
    var highlightedAfterTabClicked = false;

    $(".species-page-tab").on('click touchend', function(e) {
        e.preventDefault();

        $('.species-page-tab').removeClass(highlitedClass);
        $(this).addClass(highlitedClass);

        if (!$("#" + this.dataset.id).length) return;

        highlightedAfterTabClicked = true;
        var anchorElementOffset = $("#" + this.dataset.id).offset().top;

        // Change page flow with adding class "sticky" to tabs, get new anchorElementOffset
        anchorElementOffset = addStickyToSpecies(anchorElementOffset, "#" + this.dataset.id);

        $('body, html').animate(
            {
                scrollTop: anchorElementOffset - speciesHeight
            },
            500,
            'swing',
            function complete() {
                setTimeout(function () {
                    highlightedAfterTabClicked = false;
                }, 50);
            }
        );
    });

    window.addEventListener('scroll', function() {
        addStickyToSpecies($(window).scrollTop());
    });

    // move tab row from default place to change flow, and add sticky class to tab row
    function addStickyToSpecies(elementTopOffset, anchorElementSelector) {
        var $birdAbout = $('#bird-about');
        if (!$birdAbout.length) return;

        var $speciesTabs = $('.species-page-tabs__inner-container');
        if ($('#admin-menu').length) {
            $speciesTabs.addClass('offset-from-admin-menu');
        }

        if ($('.species-page-tab').closest('.bird-guide-container').length) {
            var compareTopOffset = $('.species-page-tab').get(0).getBoundingClientRect().bottom + pageYOffset - $('#admin-menu').height();
        } else {
            var compareTopOffset = $('.bird-guide-card.node.node-bird').offset().top  - $('#admin-menu').height();
        }

        if (elementTopOffset >= compareTopOffset) {
            if (!$speciesTabs.hasClass('sticky')) {
                $speciesTabs.addClass('sticky');
                $birdAbout.closest('section').prepend($birdAbout);
            }
        } else {
            $speciesTabs.removeClass('sticky');
            $birdAbout.insertAfter('.bird-guide-image');
        }
        higlightTabByTopOffset();

        return anchorElementSelector ? $(anchorElementSelector).offset().top : 0;
    }

    function higlightTabByTopOffset() {
        if (highlightedAfterTabClicked) return;

        var idx = -1;
        $('.species-page-tab').removeClass(highlitedClass);

        $.each($('.species-page-tab'), function(key, el) {
            var $element = $("#" + el.dataset.id);
            if (!$element.length) return;

            if ($(window).scrollTop() > $element.offset().top - speciesHeight) {
                idx = key;
            }
        });
        if (idx != -1) {
            $('.species-page-tab').eq(idx).addClass(highlitedClass);
        }
    }
});