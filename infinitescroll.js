define(['jquery'], function($) {
  'use strict';

  var $window = $(window), $document = $(document),
  registry = {};

  function scrolled() {
    var scrollBottom = $document.height() -
        (window.innerHeight || $window.height()) -
        $window.scrollTop();

    return (scrollBottom / (window.innerHeight || $window.height()));
  }

  function scroll() {
    var breakpoint, s = scrolled();

    for ( breakpoint in registry ) {
      if ( s < Number(breakpoint) ) {
        registry[breakpoint].fire();
      }
    }
  }

  function infinitescroll( breakpoint, callback ) {
    breakpoint = Number(breakpoint).toString();

    var cb = registry[breakpoint];

    if (!cb) {
      cb = registry[breakpoint] = new $.Callbacks();
    }

    cb.add(callback);

    // First check
    scroll();
  }

  infinitescroll.remove = function( fn ) {
    var breakpoint, cb;
    for ( breakpoint in registry ) {
      cb = registry[breakpoint];
      cb.remove(fn);
    }
  };

  infinitescroll.check = scroll;

  $window.on('scroll', scroll);

  return infinitescroll;
});
