!function(a){Drupal.CTools=Drupal.CTools||{},Drupal.CTools.AJAX=Drupal.CTools.AJAX||{},Drupal.CTools.AJAX.warmCache=function(){$this=a(this);var o=$this.attr("href");if($this.hasClass("ctools-fetching")||Drupal.CTools.AJAX.commandCache[o])return!1;var t=a('a[href="'+o+'"]');t.addClass("ctools-fetching");try{url=o.replace(/\/nojs(\/|$)/g,"/ajax$1"),a.ajax({type:"POST",url:url,data:{js:1,ctools_ajax:1},global:!0,success:function(a){Drupal.CTools.AJAX.commandCache[o]=a,t.addClass("ctools-cache-warmed").trigger("ctools-cache-warm",[a])},complete:function(){t.removeClass("ctools-fetching")},dataType:"json"})}catch(a){return t.removeClass("ctools-fetching"),!1}return!1},Drupal.CTools.AJAX.clickAJAXCacheLink=function(){return $this=a(this),$this.hasClass("ctools-fetching")?($this.bind("ctools-cache-warm",function(a,o){Drupal.CTools.AJAX.respond(o)}),!1):$this.hasClass("ctools-cache-warmed")&&Drupal.CTools.AJAX.commandCache[$this.attr("href")]?(Drupal.CTools.AJAX.respond(Drupal.CTools.AJAX.commandCache[$this.attr("href")]),!1):Drupal.CTools.AJAX.clickAJAXLink.apply(this)},Drupal.CTools.AJAX.findURL=function(o){var t="",l="."+a(o).attr("id")+"-url";return a(l).each(function(){var o=a(this);t&&o.val()&&(t+="/"),t+=o.val()}),t},a(function(){Drupal.ajax.prototype.commands.attr=function(o,t,l){a(t.selector).attr(t.name,t.value)},Drupal.ajax.prototype.commands.redirect=function(a,o,t){o.delay>0?setTimeout(function(){location.href=o.url},o.delay):location.href=o.url},Drupal.ajax.prototype.commands.reload=function(a,o,t){location.reload()},Drupal.ajax.prototype.commands.submit=function(o,t,l){a(t.selector).submit()}})}(jQuery);
