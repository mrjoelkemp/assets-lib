define([
  'jquery',
  'jquery/ui/core'
], function($) {
  'use strict';

  function defaultTemplate(text) {
    return '<div class="tag">' + text + '</div>';
  }

  function render(input, template) {
    template = template || defaultTemplate;
    var el = $.parseHTML(template(input))[0];
    if (!el) { return; }

    el.contentEditable = false;
    el.unselectable = 'on';
    $(el).data('value', input).addClass('js-tag');
    return el;
  }

  var commitText = function(e, options) {
    var text;
    Array.prototype.some.call(this.childNodes, function(node) {
      if (node.nodeType === Element.TEXT_NODE) {
        return !!(text = node);
      }
    });

    e.preventDefault();
    if (!text) { return; }

    this.insertBefore(render(text.textContent.trim(), options && options.template), text);
    this.removeChild(text);
    $(this).trigger('change');
  },

  deleteTag = function() {
    if (!window.getSelection) { return; }

    var selection = window.getSelection(),
        anchor = selection.anchorNode,
        anchorOffset = selection.anchorOffset;

    // Remove previous child
    if (anchor === this && anchorOffset > 0) {
      this.childNodes[anchorOffset - 1].remove();
      $(this).trigger('change');
    }
    else if (anchor.nodeType === Element.TEXT_NODE && anchorOffset === 0) {
      if (anchor.previousSibling) {
        anchor.previousSibling.remove();
        $(this).trigger('change');
      }
    }
  },

  keydownMap = {};
  keydownMap[$.ui.keyCode.ENTER] = commitText;
  keydownMap[$.ui.keyCode.COMMA] = commitText;
  keydownMap[$.ui.keyCode.BACKSPACE] = deleteTag;

  return function tagify($context, options) {
    return $('<div>', {
      contenteditable: true,
      placeholder: $context[0].placeholder,
      class: $context[0].className
    })
    .css({
      height: 'auto',
      whiteSpace: 'pre-wrap',
      minHeight: $context.height()
    })
    .on({
      'input keypress': function() {
        $(this).toggleClass('has-value', !!this.textContent);
      },
      keydown: function(event) {
        var fn;
        return (fn = keydownMap[event.which]) && fn.call(this, event, options);
      },
      change: function() {
        var value = $(this).find('.js-tag').toArray()
        .map(function(tag) {
          return $(tag).data('value');
        });

        value = (options && options.serialize) ? options.serialize(value) : value.join('|');
        $context.val(value);
      }
    })
    .insertAfter($context.hide());
  };
});
