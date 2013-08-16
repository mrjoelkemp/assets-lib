define(['nbd/trait/promise'], function(Promise) {
  'use strict';

  return function(apikey, el, options, source) {
    var promise = new Promise();

    if ( typeof options !== 'object' )  {
      source = options;
      options = {};
    }

    source = source || '//www.google.com/recaptcha/api/js/recaptcha_ajax.js';

    require([source], function() {
      /*global Recaptcha */
      Recaptcha.create(apikey, el, options);
      promise.resolve( Recaptcha );
    }, promise.reject);

    return promise.thenable();
  };

});
