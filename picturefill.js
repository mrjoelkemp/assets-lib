define(['jquery'], function($) {
  'use strict';

  var mm = window.matchMedia || window.msMatchMedia,
  mkimg = function() {
    var $this = $(this), $source = $this.find('div[data-src]');

    if (!$source.length) {
      $this.find('img').remove();
      return;
    }

    if (mm) {
      $source = $source.first().add($source.filter(function() {
        var m = $(this).data('media');
        return m && mm(m).matches;
      })).last();
    }

    $('<img>', {
      alt: $this.data('alt'),
      src: $source.data('src'),
      'class': $source.data('class'),
      title: $source.data('title'),
      'data-pin-nopin': 'pin'
    }).appendTo($this);
  };

  return ($.fn.picturefill = function() {
    this.find('div[data-picture]').each(mkimg);
    return this;
  });
});
