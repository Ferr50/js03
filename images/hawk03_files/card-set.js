!function(e){Drupal.behaviors.card_set={attach:function(t,r){this.curtainAfterIpe=!1,e(".card-set").has(".card-set-scroller").each(function(){var t=e("body").width(),r={},s=e(this);scroll,r.on=!1,r.setup=function(){s.find(".card-set-scroller");var e=s.find(".card-set-wrapper"),t=s.find(".card-set-dots .dot"),n=new IScroll(e[0],{scrollX:!0,scrollY:!1,momentum:!1,snap:!0,bounce:!0,touch:!0,eventPassthrough:!0});n.on("scrollEnd",function(){var e=n.currentPage.pageX;t.removeClass("active"),t.eq(e).addClass("active")}),!1===this.curtainAfterIpe&&n.goToPage(1,0,1),r.on=!0},r.reset=function(){"function"==typeof scroll.destroy&&scroll.destroy(),e(".card-set-scroller").removeAttr("style"),r.on=!1},t<768&&!r.on&&r.setup(),e(document).bind("respond",function(e){"tiny"!=e.size&&"small"!=e.size&&"medium"!=e.size||r.on||r.setup(),"large"==e.size&&r.on&&r.reset()}),e("body.panels-ipe").bind("endIPE",function(){Drupal.behaviors.card_set.curtainAfterIpe=!0})})}}}(jQuery);