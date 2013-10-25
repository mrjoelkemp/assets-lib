// Top-level form module for programmictally assembling form behaviors
define([
  'nbd/Class',
  'nbd/trait/promise',
  'lib/form/decompose',
  'lib/xhr'
], function(Class, Promise, decompose, xhr) {
  'use strict';

  var Form = Class.extend({
    init: function($context) {
      this.$context = $context;
    },

    // Default submit action submits form and handles response errors.
    commit: function(form, $context) {
      this
      .then(function() {
        return xhr({
          url: $context.attr('action'),
          type: $context.attr('method') || 'POST',
          data: decompose($context.serializeArray())
        });
      })
      .then(null, function failure(reason) {
        // Actual Error
        if (reason instanceof Error) {
          console.error(reason);
          return;
        }

        console.warn(reason);
        return;
      });
    },

    onSubmit: function() {
      var self = this;

      this._bindSubmission();

      this.$context.on('submit', function() {
        var chain = new Promise();

        self.commit.call(chain, self, self.$context);
        chain.resolve();
      });
    },

    _bindSubmission: function() {
      var self = this;

      this.$context.on('click keydown', '.form-submit:not([type=submit])', function(e) {
        switch (e.which) {
          // Left mouse
          case 1:
          // Enter
          case 13:
          // Spacebar
          case 32:
            self.$context.submit();
            break;
          default:
            break;
        }
      });
    }
  });

  return Form;
});
