(function($) {
  Drupal.behaviors.article_reflow = {
    attach: function(context, settings) {
      if (!$(".reflow-body").length == 0) {
        $(document).bind("respond", function(e) {
          if (e.size == "tiny" || e.size == "small" || e.size == "medium") {
            if (Reflow.active == false) {
              Reflow.go();
            }
          } else if (e.size == "large") {
            if (Reflow.active == true) {
              Reflow.reset();
            }
          }
        });

        var Reflow = {};

        Reflow.active = false;

        Reflow.$body = $(".reflow-body");
        Reflow.$items = $(".reflow");

        Reflow.reset = function() {
          Reflow.$items.each(function() {
            var $this = $(this),
              id = $this.attr("data-reflow-id"),
              reflowClass = $this.attr("data-reflow-class"),
              $placeholder = $("[data-reflow-placeholder='" + id + "']");

            $placeholder.after($this);

            if (reflowClass) {
              $this.removeClass(reflowClass);
            }
          });

          Reflow.active = false;
        }

        Reflow.go = function() {
          Reflow._setupItems();

          Reflow.$items.filter(".reflow-into-body").each(function() {
            Reflow._flowIntoBody($(this));
          });
          Reflow.$items.filter(".reflow-into-bottom").each(function() {
            Reflow._flowIntoBottom($(this));
          });
          Reflow.$items.filter(".reflow-into-sidebar-bottom").each(function() {
            Reflow._flowIntoSidebarBottom($(this));
          });

          Reflow.active = true;
        }

        Reflow._setupItems = function() {
          var $newItems = $(".reflow:not([data-reflow='on'])");
          Reflow._makePlaceholders($newItems);
          $newItems.attr("data-reflow", "on");
        }

        Reflow._makePlaceholders = function($newItems) {
          $newItems.each(function(i) {
            var $this = $(this);

            $this.attr("data-reflow-id", i);
            $this.before("<span data-reflow-placeholder='" + i + "'></span>");
          });
        }

        Reflow._flowIntoSidebarBottom = function($item) {
          $(".article-sidebar").append($item);
        }

        Reflow._flowIntoBottom = function($item) {
          $(".global-content").append($item);
        }

        Reflow._flowIntoBody = function($item) {
          var $placement = Reflow._firstViableChunk();

          console.log($item);
          console.log($placement);

          if ($placement.length) {
            $placement.after($item);

            if ($item.attr("data-reflow-class")) {
              $item.addClass($item.attr("data-reflow-class"));
            }
          }
        }

        // Returns a chunk of the body to put the reflowed item under
        Reflow._firstViableChunk = function() {
          var $allChunks = $(".reflow-body").find("p, ul, ol"),
            goodChunks = [];

          // Previous and next elements are text objects
          $allChunks.each(function() {
            var $this = $(this),
              nextOkay = false,
              prevOkay = false;

            if ($this.prev().is($allChunks)) {
              prevOkay = true;
            }
            if ($this.next().is($allChunks)) {
              nextOkay = true;
            }

            if (prevOkay && nextOkay) {
              goodChunks.push($this);
            }
          });

          // OR previous element is a figure and next is a text object
          if (goodChunks.length == 0) {
            $allChunks.each(function() {
              var $this = $(this),
                prevOkay = false,
                nextOkay = false;

              if ($this.prev().is("figure")) {
                prevOkay = true;
              }
              if ($this.next().is($allChunks)) {
                nextOkay = true;
              }

              if (prevOkay && nextOkay) {
                goodChunks.push($this.prev());
              }
            });
          }

          return $(goodChunks[0]);
        }
      }
    }
  };
})(jQuery);
