define(['nbd/util/extend'], function(extend) {
  'use strict';

  var textlikes = [
    'text',
    'password'
  ],
      serialize;

  function textlike(selector, $context) {
    $context = $context.is(selector) ?
               $context :
               $context.find(selector);

    return $context
    .filter(function() {
      var $this = $(this);
      return $this.is(':visible') && !$this.is(':disabled');
    })
    .toArray()
    .map(function(el) {
      var obj = {},
          key = el.name || el.id;

      if (key) { obj[key] = el.value; }
      return obj;
    })
    .reduce(extend, {});
  }

  serialize = {
    form: function($context) {},
    textarea: textlike.bind(null, 'textarea'),
    radio: function() {},
    checkbox: function() {},
    select: function() {}
  };

  textlikes.forEach(function(type) {
    serialize[type] = textlike.bind(null, 'input[type="' + type + '"]');
  });

  return serialize;
});
