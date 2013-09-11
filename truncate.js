define(function() {
  'use strict';

  /**
   * Truncates a TextNode to a number of lines
   *
   * @param textNode {TextNode} The DOM TextNode
   * @param limit {number} Number of lines at which to truncate
   */
  return function(textNode, limit) {
    if (!textNode.length) { return; }

    var sel = document.createRange();

    sel.setStartBefore(textNode);
    sel.setEnd(textNode, 1);

    var height = sel.getBoundingClientRect().height,
    maxHeight = height * (limit + 0.5),
    length = textNode.length,
    delta = length,
    dir = -1;

    // Bail out if current size is within bounds
    sel.setEndAfter(textNode);
    height = sel.getBoundingClientRect().height;
    if (height < maxHeight) {
      sel.detach();
      return;
    }

    // Binary search for the last character within bounds
    while (delta !== 0) {
      delta = ~~(delta / 2);
      length = length + dir * delta;
      sel.setEnd(textNode, length);
      height = sel.getBoundingClientRect().height;
      if (dir * (height - maxHeight) > 0) { dir = -dir; }
    }

    var content = textNode.textContent.substr(0, length);
    content = content.replace(/\s+$/,'');

    sel.setEndAfter(textNode);
    // Make sure the ellipsis does not wrap
    do {
      textNode.textContent = content + '…';
      height = sel.getBoundingClientRect().height;
      content = content.substr(0, --length);
    }
    while (height > maxHeight);

    sel.detach();
  };
});
