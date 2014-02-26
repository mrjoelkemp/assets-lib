define(['nbd/util/extend'], function(extend) {
  'use strict';

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

  var serialize = {
    form: function($context) {},
    text: textlike.bind(null, 'input[type="text"]'),
    textarea: textlike.bind(null, 'textarea'),
    radio: function() {},
    checkbox: function() {},
    select: function() {}
  };

  return serialize;
});
