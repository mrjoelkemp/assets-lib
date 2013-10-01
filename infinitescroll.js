define(['jquery'], function($) {
  'use strict';

  var $window = $(window),
      $document = $(document),
      scrollCache = {},
      registry = {};

  // Check if the user's viewport has scrolled based a defined breakpoint
  function scrolled($context) {
    var elementHeight, scrollBottom;

    if ($context.is($window)) {
      elementHeight = (window.innerHeight || $window.height());
      scrollBottom = $document.height() - elementHeight - $window.scrollTop();
    }
    else {
      elementHeight = $context.prop('clientHeight');
      scrollBottom = $context.prop('scrollHeight') - elementHeight - $context.scrollTop();
    }

    return (scrollBottom / elementHeight);
  }

  function scroll(context) {
    var $context = context === 'window' ? $window : $(context);

    return function() {
      var breakpoint, s = scrolled($context);

      for ( breakpoint in registry[context] ) {
        if ( s < Number(breakpoint) ) {
          registry[context][breakpoint].fire();
        }
      }
    };
  }

  function infinitescroll(breakpoint, callback, context) {
    context = context || 'window';
    breakpoint = Number(breakpoint).toString();

    var cb, $context = context === 'window' ? $window : $(context);

    if (!registry[context]) {
      registry[context] = {};
      scrollCache[context] = scroll(context);

      $context.on('scroll', scrollCache[context]);
    }

    cb = registry[context][breakpoint];

    if (!cb) {
      cb = registry[context][breakpoint] = new $.Callbacks();
    }

    cb.add(callback);

    // First check
    scrollCache[context]();
  }

  infinitescroll.remove = function(fn, context) {
    context = context || 'window';

    var breakpoint, cb,
        $context = context === 'window' ? $window : $(context);

    for ( breakpoint in registry[context] ) {
      cb = registry[context][breakpoint];
      cb.remove(fn);
    }
  };

  infinitescroll.check = function(context) {
    context = context || 'window';

    scrollCache[context]();
  };

  return infinitescroll;
});
