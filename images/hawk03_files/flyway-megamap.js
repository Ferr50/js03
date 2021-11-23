(function($) {

$(function() {
  $(".flyway-megamap").each(function() {
    var $megamap = $(this),
        $points = $megamap.find(".flyway-megamap-point"),
        $dots = $(".flyway-path-dots a"),
        $maps = $(".flyway-path-map"),
        $descriptions = $(".flyway-path-description"),
        $flywayColumnsBlocks = $(".flyway-path-columns");

    handleResize();

    function handleResize() {
      var windowWidth = $(window).width(),
          xlgPositions = [[90, 110], [340, 75], [540, 140], [740, 70]],
          lrgPositions = [[20, 110], [280, 75], [440, 140], [620, 70]];
          positions = [];

      if (windowWidth >= 900) {
        positions = xlgPositions;
        repositionPoints(positions);
      }
      else if (windowWidth >=769) {
        positions = lrgPositions;
        repositionPoints(positions);
      }
      else {
        $points.removeAttr("style");
      }
    }

    function handleFlywaySwitch(e) {
      e.preventDefault();

      $('html, body').animate({
        scrollTop: $("#flyway-map").offset().top
      }, 300);

      var $this = $(this),
          mapId = $this.attr("id").replace("point", "map"),
          descriptionId = $this.attr("id").replace("point", "path-description"),
          flywayColumnsBlockId = $this.attr("id").replace("point", "path-columns"),
          $description = $descriptions.filter("#" + descriptionId),
          $flywayColumnsBlock = $flywayColumnsBlocks.filter("#" + flywayColumnsBlockId),
          $map = $maps.filter("#" + mapId);

      $maps.removeClass("current");
      $map.addClass("current");
      $descriptions.removeClass("current");
      $description.addClass("current");
      $flywayColumnsBlocks.removeClass("current");
      $flywayColumnsBlock.addClass("current");
    }

    function handleDotClick(e)  {
      e.preventDefault();

      var $this = $(this),
          $map = $maps.filter($this.attr("href")),
          index = ($this.index() + 1),
          descriptionId = "#flyway-path-description-" + index,
          $description = $descriptions.filter(descriptionId),
          flywayColumnsBlockId = "#flyway-path-columns-" + index,
          $flywayColumnsBlock = $flywayColumnsBlocks.filter(flywayColumnsBlockId);

      $maps.removeClass("current");
      $map.addClass("current");
      $descriptions.removeClass("current");
      $description.addClass("current");
      $flywayColumnsBlocks.removeClass("current");
      $flywayColumnsBlock.addClass("current");
    }

    function repositionPoints(positions) {
      $points.each(function(i) {
        $(this).css({
          "left": positions[i][0],
          "top": positions[i][1]
        });
      });
    }

    // Reposition the points on resize
    $(window).bind("resize", handleResize);
    $points.bind("click", handleFlywaySwitch);
    $dots.bind("click", handleDotClick);

  });
});

})(jQuery);
