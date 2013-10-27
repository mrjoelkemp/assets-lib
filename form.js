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

    // The actual submission of the form. For the majority of simple forms, this should be
    // all that needs to be overridden.
    //
    // Default implementation simply submits the form data to the form's defined endpoint.
    submission: function($context, data) {
      return this;
    },

    commit: function(chain, $context) {
      return chain
      .then(function(metadata) {
        var chain = new Promise(),
            then = chain.thenable(),
            retval;

        retval = this.submission.call(then, $context, metadata);
        chain.resolve(retval === then ? xhr(metadata) : retval);

        return chain;
      }.bind(this));
    },

    onSubmit: function() {
      var self = this;

      this._bindSubmission();

      this.$context.on('submit', function() {
        var chain = new Promise(),
            formMetadata = {
              url: self.$context.attr('action'),
              type: self.$context.attr('type') || 'POST',
              data: decompose(self.$context.serializeArray())
            };

        self.commit(chain, self.$context);
        chain.resolve(formMetadata);
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
