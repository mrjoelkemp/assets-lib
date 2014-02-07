define(['jquery'], function ($) {
  'use strict';

  function tooltip($context, message, classes) {
    var $formItem, $tooltip;

    classes = classes || [];

    $formItem = $context.closest('.js-form-item, .form-item');
    if (!$formItem.length) {
      $formItem = $context;
    }

    $tooltip = $('<div>' + message + '</div>')
                .addClass(classes.join(' '))
                .appendTo($formItem);

    // Have to hard code 8 in here as it's the border-height of
    // the :after style that creates a triangle
    $tooltip.css('top', -(($tooltip.outerHeight() + 8) - $context.position().top));

    // Apply class to form-item element since certain error sytles require that.
    $formItem.addClass('form-item-error');

    return $tooltip;
  }

  return tooltip;
});
